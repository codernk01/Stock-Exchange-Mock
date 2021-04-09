var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var mongoose = require("mongoose");
var mongodb = require('mongodb');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/stockexchange",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err,res){
    if(err){
        console.log("error");
    }
    else{
        
        console.log("database running");
    }
});
app.use(express.json());
app.use(express.urlencoded());

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

var nameSchema = new mongoose.Schema({
    UserID: Number,
    StockID: Number,
    StockName: String,
    StockQty: Number,
    Action: String,
    Price: Number
});
var TradeSchema = new mongoose.Schema({
    SellerID: Number,
    BuyerID:Number,
    StockID: Number,
    StockName: String,
    StockQty: Number,
    Price: Number
});
var buyuser = mongoose.model("buyorders", nameSchema);
var selluser = mongoose.model("sellorders", nameSchema);
var trade=mongoose.model("trades",TradeSchema);
app.get('/',(req,res)=>{
    res.redirect("/order_gateway");
})
app.get('/order_gateway',(req,res)=>{
    res.render("postorder");
})
app.post('/order_gateway',async (req,res) => {
    if(req.body.Action=="BUY")
    {   const orders= await selluser.findOneAndDelete({StockID : req.body.StockID , StockQty: req.body.StockQty , Price: req.body.Price})
        if(orders && orders.UserID != req.body.UserID)
        {
            var newtrade = new trade({
                SellerID: orders.UserID,
                BuyerID: req.body.UserID,
                StockID: orders.StockID,
                StockName: orders.StockName,
                StockQty: orders.StockQty,
                Price: orders.Price
            });
            newtrade.save()
            .then(item => {
                console.log(newtrade)
                res.redirect('/data_gateway')
            })
            .catch(err => {
                res.status(400).send("Unable to save Trade to database");
            });
        }
        else
        {
            var myData = new buyuser(req.body);
            myData.save()
        .then(item => {
            console.log(myData)
            res.send("ORDER saved to database. Check all Market Trades after some time for Trade Confirmation. "+'<a style="padding-top: 100px" href="http://localhost:8000/data_gateway">See All Market Trades</a>');
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
        }
        
    }
    else
    {
        const orders= await buyuser.findOneAndDelete({StockID : req.body.StockID , StockQty: req.body.StockQty , Price: req.body.Price})
        if(orders && orders.UserID != req.body.UserID)
        {
            var newtrade = new trade({
                SellerID: req.body.UserID,
                BuyerID: orders.UserID,
                StockID: orders.StockID,
                StockName: orders.StockName,
                StockQty: orders.StockQty,
                Price: orders.Price
            });
            newtrade.save()
            .then(item => {
                console.log(newtrade)
                res.redirect('/data_gateway')
            })
            .catch(err => {
                res.status(400).send("Unable to save Trade to database");
            });
        }
        else
        {

            var myData = new selluser(req.body);  
            myData.save()
        .then(item => {
            console.log(myData)
            res.send("ORDER saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
        } 
    }
})
app.get('/data_gateway',async (req,res) => {
   const trading = await trade.find({})
  // console.log({trading})
   res.render('Trades', { trading })
})

app.listen(8000,()=>{
    console.log("Listening on port 8000!")
})