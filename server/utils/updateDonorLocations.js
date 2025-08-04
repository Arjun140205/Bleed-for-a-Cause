/**
 * This script will update existing donors in the database with random location data.
 * For testing purposes only - would be replaced by proper location data collection in production.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../models/donor.js';
import connectDB from '../config/connectDB.js';

dotenv.config();

// Function to generate random coordinates within India
function getRandomIndiaCoordinates() {
  // Approximate bounds for India
  const minLat = 8.4;
  const maxLat = 37.6;
  const minLng = 68.7;
  const maxLng = 97.25;
  
  // Generate random coordinates
  const lat = minLat + Math.random() * (maxLat - minLat);
  const lng = minLng + Math.random() * (maxLng - minLng);
  
  return [lng, lat]; // MongoDB uses [longitude, latitude] format
}

// Function to generate tighter cluster of coordinates (within ~10km)
function getClusteredCoordinates(centerLat, centerLng) {
  // 0.1 degrees is roughly 10km
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  return [centerLng + lngOffset, centerLat + latOffset];
}

async function updateDonorLocations() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    // Get all donors
    const donors = await Donor.find({});
    
    if (!donors.length) {
      console.log('No donors found in database.');
      return;
    }
    
    console.log(`Found ${donors.length} donors to update.`);
    
    // Check if any donors have invalid blood types
    for (const donor of donors) {
      // Normalize blood type if needed
      if (donor.bloodType) {
        const bloodType = donor.bloodType.toString().toLowerCase();
        
        // Map any non-standard format to standard format
        if (bloodType === 'b_positive' || bloodType === 'bpositive') {
          donor.bloodType = 'b+';
        } else if (bloodType === 'a_positive' || bloodType === 'apositive') {
          donor.bloodType = 'a+';
        } else if (bloodType === 'ab_positive' || bloodType === 'abpositive') {
          donor.bloodType = 'ab+';
        } else if (bloodType === 'o_positive' || bloodType === 'opositive') {
          donor.bloodType = 'o+';
        } else if (bloodType === 'b_negative' || bloodType === 'bnegative') {
          donor.bloodType = 'b-';
        } else if (bloodType === 'a_negative' || bloodType === 'anegative') {
          donor.bloodType = 'a-';
        } else if (bloodType === 'ab_negative' || bloodType === 'abnegative') {
          donor.bloodType = 'ab-';
        } else if (bloodType === 'o_negative' || bloodType === 'onegative') {
          donor.bloodType = 'o-';
        }
        
        // If no blood type, set a default one
        if (!["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"].includes(donor.bloodType)) {
          console.log(`Fixing invalid blood type ${donor.bloodType} for donor ${donor.name}`);
          donor.bloodType = 'o+'; // Default to universal donor
        }
      } else {
        donor.bloodType = 'o+'; // Default to universal donor if none exists
      }
    }
    
    console.log('Blood types validated, updating locations...');
    
    // Generate a center point (e.g., Delhi)
    const centerLat = 28.7041;
    const centerLng = 77.1025;
    
    // Update each donor with location
    for (const donor of donors) {
      // 80% will be clustered around the center, 20% will be random
      const coordinates = Math.random() > 0.2 
        ? getClusteredCoordinates(centerLat, centerLng) 
        : getRandomIndiaCoordinates();
      
      // Update the donor's location
      donor.location = {
        type: 'Point',
        coordinates
      };
      
      // Update address based on coordinates (simplistic)
      donor.address = `Location at ${coordinates[1].toFixed(4)}, ${coordinates[0].toFixed(4)}`;
      
      // Use updateOne instead of save to bypass schema validation temporarily
      await Donor.updateOne(
        { _id: donor._id },
        { 
          $set: {
            bloodType: donor.bloodType,
            location: donor.location,
            address: donor.address
          }
        }
      );
      
      console.log(`Updated donor: ${donor.name}, Blood Type: ${donor.bloodType}`);
    }
    
    console.log('Successfully updated donor locations.');
  } catch (error) {
    console.error('Error updating donor locations:', error);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

// Run the update function
updateDonorLocations();
