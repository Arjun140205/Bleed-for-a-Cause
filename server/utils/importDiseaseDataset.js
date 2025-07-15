import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import DiseaseDataset from "../models/diseaseDataset.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb+srv://arjunbirsingh1699:bmNgiKLA5hHbNCbr@bleedforacause.xkgwjjr.mongodb.net/BleedForACause?retryWrites=true&w=majority&appName=bleedforacause', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const results = [];
fs.createReadStream(path.join(__dirname, '../../ai-backend/dataset.csv'))
  .pipe(csv())
  .on('data', (data) => {
    results.push(data);
  })
  .on('end', async () => {
    try {
      await DiseaseDataset.insertMany(results);
      console.log('Disease dataset import successful!');
      mongoose.disconnect();
    } catch (err) {
      console.error(err);
      mongoose.disconnect();
    }
  }); 