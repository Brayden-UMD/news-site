//Use code in other files
const GET_REQUESTS = require('./get_requests.js');
const POST_REQUESTS = require('./post_requests.js');

//Imports
const express = require('express');

//Constants
exports.APP = express(); //Our express app
const PORT = 80; //The port we will be using
var SERVER; //Our express server


/*===========================================
              Main (Entry Point)
===========================================*/
async function main() {
    console.log("[News Website]");

    //Initialize GET route handlers
    console.log("Initializing GET route handlers...");
    GET_REQUESTS.initializeGETHandlers();

    //Initialize POST route handlers
    console.log("Initializing POST route handlers...");
    POST_REQUESTS.initializePOSTHandlers();

    SERVER = await exports.APP.listen(PORT, () => { //Await server startup
        console.log(`Web server started and running at: http://localhost:${PORT}`);
    }).on('error', () => {
        console.log(`Web server failed to start. Port \"${PORT}\" is probably in use!`);
        process.exit(1);
    })
}

main();