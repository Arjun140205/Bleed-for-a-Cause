import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import setupIndexes from "./config/setupIndexes.js";
import { insertSampleHospitals } from './config/sampleData.js';
import { authMiddleware, sanitizeResponse } from "./middleware/auth.js";
import authRouter from "./routes/auth.js";
import apiRouter from "./routes/apiRoutes.js";
import patientRouter from "./routes/patientAPI.js";
import donorRouter from "./routes/donorAPI.js";
import hospitalRouter from "./routes/hospitalAPI.js";
import thalassemiaRouter from "./routes/thalassemiaRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "http://127.0.0.1:5175",
      "https://bleed-for-a-cause-client.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());
app.use(sanitizeResponse);

// Public routes
app.use("/auth", authRouter);

// Protected routes
app.use(authMiddleware); // Apply auth middleware to all protected routes
app.use("/", apiRouter); // Mount API routes at root to match the /api/symptoms path
app.use("/patient", patientRouter);
app.use("/donor", donorRouter);
app.use("/hospital", hospitalRouter);
app.use("/thalassemia", thalassemiaRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred'
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Bleed for a Cause API");
});

// Initialize database, indexes, and start server
const initializeApp = async () => {
  try {
    await connectDB();
    await setupIndexes();
    console.log('Database initialized successfully');

    // Initialize sample data if LOAD_SAMPLE_DATA env var is set
    if (process.env.LOAD_SAMPLE_DATA === 'true') {
      try {
        await insertSampleHospitals();
        console.log('Sample data loaded successfully');
      } catch (error) {
        console.warn('Failed to load sample data:', error.message);
        // Continue startup even if sample data fails
      }
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

initializeApp();
