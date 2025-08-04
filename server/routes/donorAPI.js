import jwt from "jsonwebtoken";
import { Router } from "express";
import Donor from "../models/donor.js";
import { findCompatibleDonors } from "../utils/donorMatching.js";
const donorRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET; 

// Check if donor information is missing
donorRouter.post("/checkInfo", async (req, res) => {
  const { token } = req.body;
  let user;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    user = await Donor.findById(decoded.id).select("-password");

    console.log(user);
    

    if (!user.bloodType || !user.lastDonationDate || !user.state || !user.district) {
      return res.json({ missing: true });
    }

    res.json({ missing: false, user });
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Update donor info
donorRouter.post("/updateInfo", async (req, res) => {
  const { token, bloodType, lastDonationDate, state, district, medicalCondition } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const updatedUser = await Donor.updateOne(
      { _id: decoded.id }, // Find donor by ID
      {
        $set: {
          bloodType,
          lastDonationDate,
          state,
          district,
          medicalCondition,
        },
      }
    );
    

    if (updatedUser.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// Get donation history
donorRouter.post("/history", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const donor = await Donor.findById(decoded.id).select("-password");
    
    if (!donor) {
      return res.status(404).json({ error: "Donor not found" });
    }

    // Return sample donation history and appointments
    res.json({ 
      success: true,
      donations: [
        {
          date: '2023-08-15',
          location: 'Lifesaving Medical Center',
          units: 1,
          bloodType: 'A+',
          status: 'Completed'
        },
        {
          date: '2023-10-27',
          location: 'Blood Donation Drive - Community Hall',
          units: 1,
          bloodType: 'A+',
          status: 'Completed'
        }
      ],
      appointments: [
        {
          date: '2024-01-20',
          time: '10:30 AM',
          location: 'Central Hospital',
          status: 'Scheduled'
        }
      ]
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

/**
 * @route   POST /api/donor/find-compatible
 * @desc    Find nearby compatible donors
 * @access  Private
 */
donorRouter.post("/find-compatible", async (req, res) => {
  try {
    const { bloodType, location, authToken } = req.body;
    
    if (!bloodType || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: "Blood type and location are required"
      });
    }

    // Verify user authentication (optional)
    if (authToken) {
      try {
        jwt.verify(authToken, JWT_SECRET);
        // You could extract patient ID here if needed
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token"
        });
      }
    }

    // Get all donors
    const allDonors = await Donor.find({
      bloodType: { $exists: true },
      'location.coordinates.0': { $ne: 0 }, // Only donors with location data
      'location.coordinates.1': { $ne: 0 }
    });

    // Find compatible donors within 10km radius
    const compatibleDonors = findCompatibleDonors(
      allDonors,
      bloodType,
      location.lat,
      location.lng,
      10 // Max 10km radius
    );

    // Return limited information about donors
    const safeDonerInfo = compatibleDonors.map(donor => ({
      name: donor.name,
      bloodType: donor.bloodType,
      distance: donor.distance,
      district: donor.district,
      state: donor.state
    }));

    return res.status(200).json({
      success: true,
      count: safeDonerInfo.length,
      donors: safeDonerInfo
    });
  } catch (error) {
    console.error("Error finding compatible donors:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while finding donors"
    });
  }
});

export default donorRouter;
