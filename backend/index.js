require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db(); // Uses default db from connection string

    // Collections
    const usersCollection = db.collection('user'); // from better-auth
    const mealsCollection = db.collection('meals');
    const financesCollection = db.collection('finances');
    const noticesCollection = db.collection('notices');
    const reviewsCollection = db.collection('reviews');

    // ==========================================
    // USERS / MEMBERS ENDPOINTS
    // ==========================================
    app.get('/api/members', async (req, res) => {
      try {
        const members = await usersCollection.find({ role: 'member' }).toArray();
        res.json(members);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // MEALS ENDPOINTS
    // ==========================================
    app.get('/api/meals', async (req, res) => {
      try {
        const meals = await mealsCollection.find().toArray();
        res.json(meals);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/meals', async (req, res) => {
      try {
        const newMeal = req.body;
        newMeal.createdAt = new Date();
        const result = await mealsCollection.insertOne(newMeal);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // FINANCES ENDPOINTS
    // ==========================================
    app.get('/api/finances', async (req, res) => {
      try {
        const finances = await financesCollection.find().toArray();
        res.json(finances);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/finances', async (req, res) => {
      try {
        const newRecord = req.body;
        newRecord.createdAt = new Date();
        const result = await financesCollection.insertOne(newRecord);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // NOTICES ENDPOINTS
    // ==========================================
    app.get('/api/notices', async (req, res) => {
      try {
        // Fetch notices sorted by newest first
        const notices = await noticesCollection.find().sort({ createdAt: -1 }).toArray();
        res.json(notices);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/notices', async (req, res) => {
      try {
        const newNotice = req.body;
        newNotice.createdAt = new Date();
        const result = await noticesCollection.insertOne(newNotice);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.delete('/api/notices/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await noticesCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ==========================================
    // REVIEWS ENDPOINTS
    // ==========================================
    app.get('/api/reviews', async (req, res) => {
      try {
        const reviews = await reviewsCollection.find().sort({ createdAt: -1 }).toArray();
        res.json(reviews);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/reviews', async (req, res) => {
      try {
        const newReview = req.body;
        newReview.createdAt = new Date();
        const result = await reviewsCollection.insertOne(newReview);
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Root Endpoint
    app.get('/', (req, res) => {
      res.send('11 Star House Mess Management API is running');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

run().catch(console.dir);
