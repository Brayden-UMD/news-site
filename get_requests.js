//Use code in other files
const MAIN = require('./main.js');

//Imports
const express = require('express');
const path = require('path');

// Added
const bodyParser = require("body-parser");

require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.smmpxbp.mongodb.net/?retryWrites=true&w=majority`
const { MongoClient, ServerApiVersion } = require('mongodb');

 /* Our database and collection */
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};

/*===========================================
            GET Route Handlers
===========================================*/

function initializeGETHandlers() {
    MAIN.APP.set('views', path.join(__dirname, '/pages')); //All of our templates will be located in the "pages" folder

    //Added
    MAIN.APP.use(bodyParser.urlencoded({extended:false}));

    /* view/templating engine */
    MAIN.APP.set("view engine", "ejs");

    //Serve all static files from the "assets" folder
    MAIN.APP.use("/assets", express.static(path.join(__dirname, '/pages/assets')));

    //Serve "/index.html" 
    MAIN.APP.get('/', (request, response) => {
        response.render('index.ejs');
    });

    MAIN.APP.get('/article', (request, response) => {
        response.render('article.ejs');
        /*
            <%- image %>
            <%- table %>
            <%- subtitle %>
            <%- date %>
            <%- text %>
        */
    });

    //Serve Feedback Form
    MAIN.APP.get('/review', (request, response) => {
        response.render('submitFeedback');
    });

    //Feedback confirmation
    MAIN.APP.post("/processFeedback", async (request, response) => {
        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
    
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
            await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(feedback);
            
            response.render("processFeedback", feedback);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });

    // Display Review List
    MAIN.APP.get("/reviewList", async (request, response) => {
        const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
        let reviewTable = '';
    
        try {
            await client.connect();
    
            let filter = {};
            const cursor = client.db(databaseAndCollection.db)
            .collection(databaseAndCollection.collection)
            .find(filter);
    
            const result = await cursor.toArray();
    
            if (result.length > 0) {
                result.forEach(element => {
                    reviewTable += `<tr><td>${element.name}</td><td>${element.email}</td><td>${element.review}</td><td>${element.timeCompleted}</td></tr>`; 
                });
                const reviewList = {
                    numberReviews: result.length,
                    reviewTable: reviewTable
                };
                response.render("displayReview", reviewList);
            } else {
                const reviewList = {
                    numberReviews: 0,
                    reviewTable: reviewTable
                };
                response.render("displayReview", reviewList);
            }      
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    });

}

module.exports = { initializeGETHandlers };