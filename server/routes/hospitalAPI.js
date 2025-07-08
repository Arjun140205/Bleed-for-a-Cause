import { Router } from "express";
import BloodRequest from "../models/bloodRequest.js";
import Hospital from "../models/hospital.js";
import jwt from "jsonwebtoken";

const hospitalRouter = Router();

hospitalRouter.post("/api/bloodRequests", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const requests = await BloodRequest.find({
      hospitalId: hospital._id,
      status: "active",
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

hospitalRouter.put("/api/bloodRequests/:id/status", async (req, res) => {
  const { token, status } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.id);

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
hospitalRouter.put("/api/update-inventory", async (req, res) => {
  const { token, bloodType, units } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hospital = await Hospital.findById(decoded.id);

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
