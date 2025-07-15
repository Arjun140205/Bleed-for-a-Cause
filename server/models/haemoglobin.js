import mongoose from "mongoose";

const haemoglobinSchema = new mongoose.Schema({
  age: Number,
  gender: String,
  weight: Number,
  height: Number,
  dietary_habits: String,
  medical_history: String,
  previous_haemoglobin: Number,
  haemoglobin: Number
});

const Haemoglobin = mongoose.model('Haemoglobin', haemoglobinSchema);
export default Haemoglobin; 