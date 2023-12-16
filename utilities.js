//Use code in other files
const MAIN = require('./main.js');

//==================================================

//Get an article from the database by it's ID - returns the article as a JSON object, or "null" if not found.
async function getArticleByID(id) {

    // Access the articles collection
    const collection = MAIN.CLIENT.db(MAIN.articlesDatabaseAndCollection.db).collection(MAIN.articlesDatabaseAndCollection.collection);

    // Query the database to get the article
    const article = await collection.findOne({ _id: id });

    return article;
}

//Query the Database and pull all the articles we have, before putting them into displayable blocks
async function getArticles() {
    var allArticles = "";

    // Access the articles collection
    const collection = MAIN.CLIENT.db(MAIN.articlesDatabaseAndCollection.db).collection(MAIN.articlesDatabaseAndCollection.collection);

    // Query the database to get all articles
    const articles = await collection.find().toArray();

    // Loop through the articles and create displayable blocks
    articles.forEach(article => {
        const postBlock = createPostBlock(article._id, article.title, article.subtitle);
        allArticles += postBlock;
    });

    return allArticles;
}


//For displaying articles on the home page
function createPostBlock(id, title, subtitle) { //For displaying articles on the home page
    return `<div class="post-preview">
    <a href="/article/${id}">
    <h2 class="post-title">${title}</h2>
    <h3 class="post-subtitle">${subtitle}</h3>
    </a>
    </div><hr>`;
}

module.exports = { getArticles, getArticleByID };
