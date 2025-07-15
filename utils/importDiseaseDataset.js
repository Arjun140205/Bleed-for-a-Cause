import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = 'mongodb+srv://arjunbirsingh1699:bmNgiKLA5hHbNCbr@bleedforacause.xkgwjjr.mongodb.net/importtestdb?retryWrites=true&w=majority&appName=bleedforacause';

const bloodSchema = new mongoose.Schema({}, { strict: false });
const Blood = mongoose.model('blood', bloodSchema);

mongoose.connect(MONGO_URI);

const results = [];
fs.createReadStream(path.join(__dirname, '../../ai-backend/dataset.csv'))
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    try {
      await Blood.insertMany(results);
      console.log('Disease dataset import to importtestdb.blood successful!');
      mongoose.disconnect();
    } catch (err) {
      console.error(err);
      mongoose.disconnect();
    }
  }); 