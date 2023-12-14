//Use code in other files
const MAIN = require('./main.js');

//Imports
const express = require('express');
const path = require('path');

// Added
const bodyParser = require("body-parser");

require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

//This is a repeat of what's in get_requests.js but whatever
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.smmpxbp.mongodb.net/?retryWrites=true&w=majority`
const { MongoClient, ServerApiVersion } = require('mongodb');


 /* Our database and collection */
 const feedbackDatabaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_FEEDBACK_COLLECTION};
 const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

/*===========================================
            POST Route Handlers
===========================================*/

function initializePOSTHandlers() {
    //Feedback confirmation
    MAIN.APP.post("/processFeedback", async (request, response) => {
        try {
            await client.connect();
            let date = new Date();

            /* Inserting application */
            const feedback = {
                name: request.body.name, 
                email: request.body.email, 
                review: request.body.review, 
                timeCompleted: date.toDateString()
            };
            await client.db(feedbackDatabaseAndCollection.db).collection(feedbackDatabaseAndCollection.collection).insertOne(feedback);
            
            response.render("processFeedback", feedback);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });
}

module.exports = { initializePOSTHandlers };