import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.js";
import apiRouter from "./routes/apiRoutes.js";
import patientRouter from "./routes/patientAPI.js";
import donorRouter from "./routes/donorAPI.js";
import hospitalRouter from "./routes/hospitalAPI.js";

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
      "http://127.0.0.1:5175"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/", apiRouter);
app.use("/patient", patientRouter);
app.use("/donor", donorRouter);
app.use("/hospital", hospitalRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Bleed for a Cause API");
});

import { insertSampleHospitals } from './config/sampleData.js';

const startServer = async () => {
  try {
    await connectDB();
    await insertSampleHospitals();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
