import mongoose from "mongoose";

const diseaseDatasetSchema = new mongoose.Schema({}, { strict: false });

const DiseaseDataset = mongoose.model('DiseaseDataset', diseaseDatasetSchema);
export default DiseaseDataset; 