//This is for development use only! It adds articles to the db.

const path = require('path');
const { nanoid } = require('nanoid');

require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.smmpxbp.mongodb.net/?retryWrites=true&w=majority`
const { MongoClient, ServerApiVersion } = require('mongodb');

const articlesDatabaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_ARTICLE_COLLECTION};
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });

//=======================================================

async function connectToDatabase() {
    try {
      await client.connect();
      console.log('Connected to the database');
    } catch (err) {
      console.error('Error connecting to the database:', err);
    }
  }
  
  async function addArticle(articleDetails) {
    try {
      const database = client.db(articlesDatabaseAndCollection.db);
      const collection = database.collection(articlesDatabaseAndCollection.collection);
  
      // Generate a unique 10-digit ID (you can customize this logic if needed)
      const uniqueId = generateUniqueId();
  
      // Add the article to the collection
      const result = await collection.insertOne({
        _id: nanoid(7),
        title: articleDetails.title,
        subtitle: articleDetails.subtitle,
        backgroundImage: articleDetails.backgroundImage,
        authorName: articleDetails.authorName,
        articleText: articleDetails.articleText,
      });
  
      console.log(`Article added with ID: ${result.insertedId.toString()}`);
    } catch (err) {
      console.error('Error adding article:', err);
    }
  }
  
  function generateUniqueId() {
    // Generate a random 10-digit ID (you can customize this logic if needed)
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
  
  async function closeConnection() {
    await client.close();
    console.log('Connection closed');
  }
  
  // Example usage:
  connectToDatabase().then(() => {
    const sampleArticle = {
      title: 'Sample Title',
      subtitle: 'Sample Subtitle',
      backgroundImage: 'sample.jpg',
      authorName: 'John Doe',
      articleText: 'This is the content of the article...',
    };
  
    addArticle(sampleArticle).then(() => {
      closeConnection();
    });
  });


