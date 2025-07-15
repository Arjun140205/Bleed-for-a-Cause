import mongoose from "mongoose";
import Haemoglobin from "../models/haemoglobin.js";
import BloodDemand from "../models/bloodDemand.js";
import DiseaseDataset from "../models/diseaseDataset.js";

const MONGO_URI = "mongodb+srv://arjunbirsingh1699:bmNgiKLA5hHbNCbr@bleedforacause.xkgwjjr.mongodb.net/BleedForACause";

async function checkData() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB\n");

  const haemoglobinCount = await Haemoglobin.countDocuments();
  const haemoglobinSample = await Haemoglobin.findOne();
  console.log(`Haemoglobins: ${haemoglobinCount}`);
  if (haemoglobinSample) console.log("Sample:", haemoglobinSample);
  else console.log("No haemoglobin data found.");
  console.log("\n----------------------\n");

  const bloodDemandCount = await BloodDemand.countDocuments();
  const bloodDemandSample = await BloodDemand.findOne();
  console.log(`BloodDemands: ${bloodDemandCount}`);
  if (bloodDemandSample) console.log("Sample:", bloodDemandSample);
  else console.log("No blood demand data found.");
  console.log("\n----------------------\n");

  const diseaseDatasetCount = await DiseaseDataset.countDocuments();
  const diseaseDatasetSample = await DiseaseDataset.findOne();
  console.log(`DiseaseDatasets: ${diseaseDatasetCount}`);
  if (diseaseDatasetSample) console.log("Sample:", diseaseDatasetSample);
  else console.log("No disease dataset data found.");

  await mongoose.disconnect();
  console.log("\nDisconnected from MongoDB");
}

checkData(); 