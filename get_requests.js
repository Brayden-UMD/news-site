//Use code in other files
const MAIN = require('./main.js');
const UTILS = require('./utilities.js');

//Imports
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

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
    MAIN.APP.get('/', async (request, response) => {
        response.render('index.ejs', {
            articles: await UTILS.getArticles()
        });
    });

    //Serve articles
    MAIN.APP.get('/article/:id', async (request, response) => {
        const ID = request.params.id;

        //Get the article from the database
        const article = await UTILS.getArticleByID(ID);

        if (article === null) { //If article is not found
            response.status(404);
            response.render("404NotFound.ejs");
        } else { //If article is found, render it
            response.render('article.ejs', {
                title: article.title,
                subtitle: article.subtitle,
                image: article.backgroundImage,
                author: article.authorName,
                text: article.articleText
            });
        }
    });

    //Serve Feedback Form
    MAIN.APP.get('/submitFeedback', (request, response) => {
        response.render('submitFeedback');
    });

    // Display Review List
    MAIN.APP.get("/displayReview", async (request, response) => {
        let reviewTable = '';
    
        try {let filter = {};
            const cursor = MAIN.CLIENT.db(MAIN.feedbackDatabaseAndCollection.db)
            .collection(MAIN.feedbackDatabaseAndCollection.collection)
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
        }
    });
}

function initialize404Handler() {
    // Since this is the last route we assume 404, as nothing else responded.
    MAIN.APP.use( function(request, response) {
        response.status(404);

        // respond with html page
        if (request.accepts('html')) {
            response.render('404NotFound.ejs', { url: request.url });
            return;
        }

        // default to plain-text. send()
        response.type('txt').send('Not found');
    });
}

module.exports = { initializeGETHandlers, initialize404Handler };