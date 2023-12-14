const path = require('path');

require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.smmpxbp.mongodb.net/?retryWrites=true&w=majority`
const { MongoClient, ServerApiVersion } = require('mongodb');

const articlesDatabaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_ARTICLE_COLLECTION};
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

//=======================================================

//Get an article from the database by it's ID - returns the article as a JSON object, or "null" if not found.
async function getArticleByID(id) {
    // Connect to the MongoDB database
    await client.connect();

    // Access the articles collection
    const collection = client.db(articlesDatabaseAndCollection.db).collection(articlesDatabaseAndCollection.collection);

    // Query the database to get the article
    const article = await collection.findOne({ _id: id });

    // Disconnect from the MongoDB database
    await client.close();

    return article;
}

//Query the Database and pull all the articles we have, before putting them into displayable blocks
async function getArticles() {
    var allArticles = "";

    // Connect to the MongoDB database
    await client.connect();

    // Access the articles collection
    const collection = client.db(articlesDatabaseAndCollection.db).collection(articlesDatabaseAndCollection.collection);

    // Query the database to get all articles
    const articles = await collection.find().toArray();

    // Loop through the articles and create displayable blocks
    articles.forEach(article => {
        const postBlock = createPostBlock(article._id, article.title, article.subtitle);
        allArticles += postBlock;
    });

    // Disconnect from the MongoDB database
    await client.close();

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
