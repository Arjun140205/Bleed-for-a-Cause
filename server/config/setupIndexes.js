import mongoose from 'mongoose';
import Donor from '../models/donor.js';

const setupIndexes = async () => {
  try {
    // Create 2dsphere index for location-based queries
    await Donor.collection.createIndex({ "location": "2dsphere" });
    
    // Create indexes for frequently queried fields
    await Donor.collection.createIndex({ "bloodType": 1 });
    await Donor.collection.createIndex({ "isEligibleToDonate": 1 });
    await Donor.collection.createIndex({ "lastDonationDate": 1 });
    
    // Compound index for location searches with blood type
    await Donor.collection.createIndex({ 
      "bloodType": 1, 
      "location": "2dsphere",
      "isEligibleToDonate": 1 
    });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
};

export default setupIndexes;
