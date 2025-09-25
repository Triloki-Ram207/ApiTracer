import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import router from './routes/apilogs.js';
import tracerMiddleware from './middlewares/apiTracker.js';
import TracerLog from './models/tracerlogs.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TRACER_API_KEY;

// 🧠 Connect to MongoDB
connectDB();

// 🛡️ Middleware
app.use(cors());
app.use(express.json());

// 🔐 API key auth middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (API_KEY !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// 📦 Tracer middleware for incoming requests
app.use('/log', tracerMiddleware(API_KEY));

// 📝 Log ingestion endpoint
app.post('/log', authMiddleware, async (req, res) => {
  try {
    console.log('Received log:', req.body);
    const logEntry = new TracerLog(req.body);
    await logEntry.save();
    res.status(201).json({ message: 'Log stored in database' });
  } catch (err) {
    console.error('❌ Tracer API error:', err.message);
    res.status(500).json({ error: 'Failed to store log' });
  }
});

// 📊 API routes
app.use('/api', router);

// 🔍 Health check
app.get('/', (req, res) => {
  console.log('/ endpoint hit');
  res.send('Hello World!');
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
