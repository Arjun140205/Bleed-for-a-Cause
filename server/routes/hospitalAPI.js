import { Router } from "express";
import BloodRequest from "../models/bloodRequest.js";
import Hospital from "../models/hospital.js";
import { authMiddleware } from "../middleware/auth.js";

const hospitalRouter = Router();

// Get blood stock alerts
hospitalRouter.get("/api/hospital/stock-alerts", async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const THRESHOLD = 5;
    const alerts = [];

    Object.entries(hospital.bloodStock).forEach(([bloodType, units]) => {
      if (units < THRESHOLD) {
        alerts.push({
          bloodType,
          units,
          message: `Low on ${bloodType} (${units} units)`,
          severity: units <= 2 ? 'CRITICAL' : 'WARNING'
        });
      }
    });

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auto-prioritize Thalassemia patients and match donors
hospitalRouter.post("/api/hospital/auto-prioritize", async (req, res) => {
  const { token, patientId } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    // Find the blood request for the patient
    const bloodRequest = await BloodRequest.findOne({ 
      patientId,
      status: { $in: ['PENDING', 'PROCESSING'] }
    }).populate('patientId');

    if (!bloodRequest || bloodRequest.patientId.condition !== 'Thalassemia') {
      return res.status(404).json({ message: "No eligible blood request found" });
    }

    // Mark as urgent
    bloodRequest.priority = 'URGENT';
    await bloodRequest.save();

    // Find nearby matching donors
    const matchingDonors = await Donor.find({
      bloodType: bloodRequest.bloodType,
      location: {
        $near: {
          $geometry: hospital.location,
          $maxDistance: 50000 // 50km radius
        }
      },
      lastDonation: { 
        $lt: new Date(Date.now() - 90*24*60*60*1000) // 90 days ago
      }
    }).limit(5);

    res.json({
      message: "Request prioritized successfully",
      matchingDonors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

hospitalRouter.get("/api/bloodRequests", authMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const requests = await BloodRequest.find({ hospital: hospital._id })
      .populate('patientId')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ message: "Failed to fetch blood requests" });
  }
});

hospitalRouter.put("/api/bloodRequests/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const hospital = await Hospital.findById(req.user.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const request = await BloodRequest.findOneAndUpdate(
      { _id: req.params.id, hospitalId: hospital._id },
      { status: status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update status" });
  }
});

// Search for blood availability
hospitalRouter.get("/search-blood", async (req, res) => {
  console.log('Search query:', req.query);
  const { bloodType, state, city } = req.query;

  try {
    const query = {};

    if (state) query.state = state;
    if (city) query.city = city;
    if (bloodType) {
      query[`bloodInventory.${bloodType}`] = { $gt: 0 };
    }

    const hospitals = await Hospital.find(query)
      .select("name state city phoneNumber bloodInventory")
      .sort({ [`bloodInventory.${bloodType}`]: -1 });

    res.json({
      success: true,
      hospitals: hospitals.map((hospital) => ({
        id: hospital._id,
        name: hospital.name,
        state: hospital.state,
        city: hospital.city,
        phoneNumber: hospital.phoneNumber,
        availableUnits: bloodType ? hospital.bloodInventory[bloodType] : null,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update blood inventory
hospitalRouter.put("/api/update-inventory", authMiddleware, async (req, res) => {
  const { bloodType, units } = req.body;

  if (!bloodType || units === undefined) {
    return res.status(400).json({ message: "Blood type and units are required" });
  }

  try {
    const hospital = await Hospital.findById(req.user.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    if (!hospital.bloodInventory[bloodType]) {
      return res.status(400).json({ message: "Invalid blood type" });
    }

    hospital.bloodInventory[bloodType] = Math.max(0, units);
    await hospital.save();

    res.json({
      success: true,
      message: "Inventory updated successfully",
      currentUnits: hospital.bloodInventory[bloodType],
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default hospitalRouter;
