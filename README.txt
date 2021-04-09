This is a Basic Stock Exchange Prototype with just 3 componenets Order Gateway,Matching Engine and Data Gateway.
To Start the Project: 
npm install : This will install the dependencies needed
node index.js : This will start the application
Then Go to http://localhost:8000 of your machine from your browser.
You will be redirected to the order_gateway where you can Enter any order of stock you would like to.
There are two Data models used in this Project One Data model is of ORDERS : 
UserID: Number,
StockID: Number,
StockName: String,
StockQty: Number,
Action: String,
Price: Number
And Another Data Model is of Trades that are executed:
    SellerID: Number,
    BuyerID:Number,
    StockID: Number,
    StockName: String,
    StockQty: Number,
    Price: Number
And For this In a database 3 collections were made one for Buying orders, one for selling orders and last one for trades that were executed.
Coming to the Matching Engine In the End, I simply used Database Queries to Find a Match for the orders to Create a Trade.
Due to lack of time I wasn't able to Create Test in Mocha and do Improvisations in this Project.

In The End I would like To Thank you for Giving me this Project as I learned a Lot while Creating this Project and I hope you will also appreciate my hardwork and efforts.