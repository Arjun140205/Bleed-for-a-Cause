import { Router } from "express";
import Hospital from "../models/hospital.js";
import BloodDemand from "../models/bloodDemand.js";
import Haemoglobin from "../models/haemoglobin.js";
import DiseaseDataset from "../models/diseaseDataset.js";
import mongoose from "mongoose";

const apiRouter = Router();

apiRouter.get("/api/getHospitals", async (req, res) => {
  const { district, bloodType } = req.query;
  
  try {
    const hospitals = await Hospital.find({
      district: district,
      [`bloodInventory.${bloodType}`]: { $gt: 0 },
    });
    
    if (hospitals.length === 0) {
      return res
        .status(404)
        .json({ message: "No hospitals found with the requested blood type" });
    }
    res.json(hospitals);
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple blood demand forecast: average of last 6 months
apiRouter.get("/api/predict/bloodDemand", async (req, res) => {
  try {
    const demands = await BloodDemand.find().sort({ date: -1 }).limit(6);
    if (!demands.length) return res.status(404).json({ error: "No data available" });
    const avgDemand = demands.reduce((sum, d) => sum + d.demand, 0) / demands.length;
    const predictions = Array(6).fill().map((_, i) => ({
      month: i + 1,
      predicted: avgDemand
    }));
    res.json({ predictions });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Haemoglobin advice: rule-based
apiRouter.post("/api/predict/haemoglobin", async (req, res) => {
  const { previous_haemoglobin } = req.body;
  let advice = '';
  if (previous_haemoglobin < 12) {
    advice = 'Your haemoglobin is low. Eat iron-rich foods.';
  } else if (previous_haemoglobin > 17) {
    advice = 'Your haemoglobin is high. Consult a doctor.';
  } else {
    advice = 'Your haemoglobin is normal. Keep it up!';
  }
  res.json({ predicted_haemoglobin: previous_haemoglobin, advice });
});

// Get all available symptoms
apiRouter.get("/api/symptoms", async (req, res) => {
  try {
    // Fetch distinct symptoms from the disease dataset
    const diseases = await DiseaseDataset.find({}, { symptoms: 1, _id: 0 });
    
    // Extract and flatten all symptoms
    let allSymptoms = [];
    diseases.forEach(disease => {
      if (disease.symptoms) {
        const diseaseSymptoms = disease.symptoms.split(',').map(s => s.trim());
        allSymptoms.push(...diseaseSymptoms);
      }
    });
    
    // Remove duplicates and sort
    const uniqueSymptoms = [...new Set(allSymptoms)].sort();
    
    res.json({ symptoms: uniqueSymptoms });
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ error: "Server error fetching symptoms" });
  }
});

// Disease prediction: simple lookup
apiRouter.post("/api/predict/disease", async (req, res) => {
  const { symptoms } = req.body; // symptoms: array of strings
  if (!Array.isArray(symptoms) || !symptoms.length) {
    return res.status(400).json({ error: "Symptoms required" });
  }
  // Find a disease entry with all symptoms present
  const entry = await DiseaseDataset.findOne({
    $and: symptoms.map(sym => ({ symptoms: { $regex: sym, $options: 'i' } }))
  });
  res.json({ predicted_disease: entry ? entry.Disease : "Unknown - consult a doctor" });
});

export default apiRouter;
