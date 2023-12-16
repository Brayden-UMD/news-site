//Use code in other files
const MAIN = require('./main.js');

/*===========================================
            POST Route Handlers
===========================================*/

function initializePOSTHandlers() {
    //Feedback confirmation
    MAIN.APP.post("/processFeedback", async (request, response) => {
        try {
            let date = new Date();

            /* Inserting application */
            const feedback = {
                name: request.body.name, 
                email: request.body.email, 
                review: request.body.review, 
                timeCompleted: date.toDateString()
            };
            await MAIN.CLIENT.db(MAIN.feedbackDatabaseAndCollection.db).collection(MAIN.feedbackDatabaseAndCollection.collection).insertOne(feedback);
            
            response.render("processFeedback", feedback);
        } catch (e) {
            console.error(e);
        }
    });
}

module.exports = { initializePOSTHandlers };