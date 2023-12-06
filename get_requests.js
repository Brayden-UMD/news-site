//Use code in other files
const MAIN = require('./main.js');

//Imports
const express = require('express');
const path = require('path');

/*===========================================
            GET Route Handlers
===========================================*/

function initializeGETHandlers() {
    MAIN.APP.set('views', path.join(__dirname, '/pages')); //All of our templates will be located in the "pages" folder

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
}

module.exports = { initializeGETHandlers };