import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import Haemoglobin from "../models/haemoglobin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb+srv://arjunbirsingh1699:bmNgiKLA5hHbNCbr@bleedforacause.xkgwjjr.mongodb.net/BleedForACause?retryWrites=true&w=majority&appName=bleedforacause', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const results = [];
fs.createReadStream(path.join(__dirname, '../../ai-backend/haemoglobin_data.csv'))
  .pipe(csv())
  .on('data', (data) => {
    data.age = Number(data.age);
    data.weight = Number(data.weight);
    data.height = Number(data.height);
    data.previous_haemoglobin = Number(data.previous_haemoglobin);
    data.haemoglobin = Number(data.haemoglobin);
    results.push(data);
  })
  .on('end', async () => {
    try {
      await Haemoglobin.insertMany(results);
      console.log('Haemoglobin data import successful!');
      mongoose.disconnect();
    } catch (err) {
      console.error(err);
      mongoose.disconnect();
    }
  }); 