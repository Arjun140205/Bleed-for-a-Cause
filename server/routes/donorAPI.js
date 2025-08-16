import { Router } from "express";
import Donor from "../models/donor.js";
import { findCompatibleDonors } from "../utils/donorMatching.js";
import { calculateEligibility, sendDonationNotification } from "../utils/donorUtils.js";
import { normalizeBloodType, validateCoordinates } from "../utils/donorValidation.js";

const donorRouter = Router();

// Check if donor information is missing
donorRouter.post("/checkInfo", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const donorId = req.user.id; // From auth middleware
    const user = await Donor.findById(donorId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const missing = !user.bloodType || !user.lastDonationDate || !user.state || !user.district;

    res.json({
      success: true,
      missing,
      user: missing ? null : user
    });
  } catch (error) {
    console.error("Error checking donor info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donor information"
    });
  }
});

// Update donor info
donorRouter.post("/updateInfo", async (req, res) => {
  try {
    const donorId = req.user.id; // From auth middleware
    const { bloodType, lastDonationDate, state, district, medicalCondition } = req.body;

    // Validate required fields
    if (!bloodType || !lastDonationDate || !state || !district) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate blood type
    const normalizedBloodType = normalizeBloodType(bloodType);
    if (!normalizedBloodType) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood type format"
      });
    }

    // Validate date
    const donationDate = new Date(lastDonationDate);
    if (isNaN(donationDate) || donationDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation date"
      });
    }

    const updatedUser = await Donor.findByIdAndUpdate(
      donorId,
      {
        bloodType: normalizedBloodType,
        lastDonationDate: donationDate,
        state,
        district,
        medicalCondition
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating donor info:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating donor information"
    });
    console.error("Error updating donor info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update donor information"
    });
  }
});

// Get donation history
donorRouter.post("/history", async (req, res) => {
  try {
    const donorId = req.user.id; // From auth middleware
    const donor = await Donor.findById(donorId)
      .select("-password")
      .populate('donations')
      .populate('appointments');
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    // Fetch actual donations and appointments from the database
    const donations = donor.donations || [];
    const appointments = donor.appointments || [];

    res.json({ 
      success: true,
      donations,
      appointments
    });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation history"
    });
  }
});

/**
 * @route   POST /api/donor/find-compatible
 * @desc    Find nearby compatible donors
 * @access  Private
 */
donorRouter.post("/find-compatible", async (req, res) => {
  try {
    const { bloodType, location, page = 1, limit = 10 } = req.body;
    
    if (!bloodType || !location || !location.lat || !location.lng) {
      return res.status(400).json({
        success: false,
        message: "Blood type and location are required"
      });
    }

    // Validate blood type format
    const normalizedBloodType = normalizeBloodType(bloodType);
    if (!normalizedBloodType) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood type format"
      });
    }

    // Validate coordinates
    if (!validateCoordinates(location.lat, location.lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates"
      });
    }

    // Validate page and limit
    if (page < 1 || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters"
      });
    }

    // Get all eligible donors with location data
    const allDonors = await Donor.find({
      bloodType: { $exists: true },
      isEligibleToDonate: true,
      'location.coordinates.0': { $ne: 0 },
      'location.coordinates.1': { $ne: 0 }
    }).select('name bloodType location district state notificationPreferences');

    // Find compatible donors within radius
    const compatibleDonors = findCompatibleDonors(
      allDonors,
      normalizedBloodType,
      location.lat,
      location.lng,
      10 // Max 10km radius
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedDonors = compatibleDonors.slice(startIndex, endIndex);

    // Return limited information about donors
    const safeDonerInfo = paginatedDonors.map(donor => ({
      name: donor.name,
      bloodType: donor.bloodType,
      distance: donor.distance,
      district: donor.district,
      state: donor.state
    }));

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(compatibleDonors.length / limit),
        totalDonors: compatibleDonors.length,
        hasMore: endIndex < compatibleDonors.length
      },
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

/**
 * @route   GET /api/donor/eligibility
 * @desc    Check donor's eligibility to donate
 * @access  Private
 */
donorRouter.get("/eligibility", async (req, res) => {
  try {
    const donorId = req.user.id; // From auth middleware

    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    const eligibilityStatus = calculateEligibility(donor.lastDonationDate);
    
    // Update donor's eligibility status
    donor.isEligibleToDonate = eligibilityStatus.isEligible;
    await donor.save();

    res.status(200).json({
      success: true,
      eligibility: eligibilityStatus
    });

  } catch (error) {
    console.error("Error checking eligibility:", error);
    res.status(500).json({
      success: false,
      message: "Error checking eligibility status"
    });
  }
});

/**
 * @route   POST /api/donor/notify-for-thalassemia
 * @desc    Notify eligible donors near patient's location
 * @access  Private
 */
donorRouter.post("/notify-for-thalassemia", async (req, res) => {
  try {
    const { location, bloodType } = req.body;

    if (!location || !bloodType) {
      return res.status(400).json({
        success: false,
        message: "Location and blood type are required"
      });
    }

    // Validate blood type
    const normalizedBloodType = normalizeBloodType(bloodType);
    if (!normalizedBloodType) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood type format"
      });
    }

    // Validate location
    if (!location.lat || !location.lng || !validateCoordinates(location.lat, location.lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates"
      });
    }

    // Find eligible donors within radius
    const eligibleDonors = await Donor.find({
      isEligibleToDonate: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat]
          },
          $maxDistance: 10000 // 10 km in meters
        }
      },
      'notificationPreferences.emailEnabled': true
    });

    // Filter for compatible blood types and send notifications
    const compatibleDonors = findCompatibleDonors(
      eligibleDonors,
      bloodType,
      location.lat,
      location.lng,
      10
    );

    // Send notifications
    const notificationPromises = compatibleDonors.map(donor =>
      sendDonationNotification(donor, { bloodType, location })
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      success: true,
      message: `Notifications sent to ${compatibleDonors.length} eligible donors`
    });

  } catch (error) {
    console.error("Error notifying donors:", error);
    res.status(500).json({
      success: false,
      message: "Error sending notifications to donors"
    });
  }
});

/**
 * @route   POST /api/donor/update-preferences
 * @desc    Update donor's notification preferences
 * @access  Private
 */
donorRouter.post("/update-preferences", async (req, res) => {
  try {
    const donorId = req.user.id; // From auth middleware
    const { smsEnabled, emailEnabled, radius } = req.body;

    // Validate inputs
    if (typeof smsEnabled !== 'boolean' || typeof emailEnabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "SMS and email enabled flags must be boolean values"
      });
    }

    // Validate radius
    if (typeof radius !== 'number' || radius < 1 || radius > 50) {
      return res.status(400).json({
        success: false,
        message: "Radius must be between 1 and 50 kilometers"
      });
    }

    const updatedDonor = await Donor.findByIdAndUpdate(
      donorId,
      {
        'notificationPreferences.smsEnabled': smsEnabled,
        'notificationPreferences.emailEnabled': emailEnabled,
        'notificationPreferences.radius': radius
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      preferences: updatedDonor.notificationPreferences
    });

  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({
      success: false,
      message: "Error updating notification preferences"
    });
  }
});

export default donorRouter;
