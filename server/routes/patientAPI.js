import { Router } from "express";
import jwt from "jsonwebtoken";
import BloodRequest from "../models/bloodRequest.js";

const JWT_SECRET = process.env.JWT_SECRET;

const patientRouter = Router();

patientRouter.post("/request-history", async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { authToken } = req.body;

    if (!authToken) {
      return res.status(400).json({ 
        success: false,
        message: "Authentication token is required" 
      });
    }

    const decoded = jwt.verify(authToken, JWT_SECRET);
    const patientId = decoded.id;

    const requests = await BloodRequest.find({ patientId })
      .populate('hospitalId', 'name city state')
      .sort({ requestDate: -1 });

    // Return empty array instead of 404 if no requests found
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Request history error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch request history"
    });
  }
});

patientRouter.post("/patient/cancelRequest", async (req, res) => {
  try {
    const { authToken, requestId } = req.body;

    if (!authToken || !requestId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const decoded = jwt.verify(authToken, JWT_SECRET);
    const patientId = decoded.id;

    const request = await BloodRequest.findOneAndUpdate(
      { _id: requestId, patientId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );

    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error("Error cancelling blood request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default patientRouter;
