//Use code in other files
const GET_REQUESTS = require('./get_requests.js');
const POST_REQUESTS = require('./post_requests.js');

//Imports
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

//Constants
exports.APP = express(); //Our express app
const PORT = 80; //The port we will be using
var SERVER; //Our express server

require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.smmpxbp.mongodb.net/?retryWrites=true&w=majority`
const { MongoClient, ServerApiVersion } = require('mongodb');

 /* Our database and collection */
exports.feedbackDatabaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_FEEDBACK_COLLECTION};
exports.articlesDatabaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_ARTICLE_COLLECTION};
exports.CLIENT = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });


/*===========================================
              Main (Entry Point)
===========================================*/
async function main() {
    console.log("[News Website]");

    //Connect to the MongoDB database
    console.log("Connecting to the database...");
    await exports.CLIENT.connect();

    //Initialize GET route handlers
    console.log("Initializing GET route handlers...");
    GET_REQUESTS.initializeGETHandlers();

    //Initialize POST route handlers
    console.log("Initializing POST route handlers...");
    POST_REQUESTS.initializePOSTHandlers();

    //We must do this last so it works
    GET_REQUESTS.initialize404Handler();

    SERVER = await exports.APP.listen(PORT, () => { //Await server startup
        console.log(`Web server started and running at: http://localhost:${PORT}`);
    }).on('error', async () => {
        console.log(`Web server failed to start. Port \"${PORT}\" is probably in use!`);
        await exports.CLIENT.close();
        process.exit(1);
    })
}

main();