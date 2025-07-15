import mongoose from "mongoose";

const bloodDemandSchema = new mongoose.Schema({
  date: Date,
  demand: Number
});

const BloodDemand = mongoose.model('BloodDemand', bloodDemandSchema);
export default BloodDemand; 