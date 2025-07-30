import { Router } from "express";
import jwt from "jsonwebtoken";
import BloodRequest from "../models/bloodRequest.js";
import Patient from "../models/patient.js";

const JWT_SECRET = process.env.JWT_SECRET;

const patientRouter = Router();

// Endpoint to fetch patient dashboard data
patientRouter.get("/dashboard", async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication token is required" 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const patientId = decoded.id;
    
    // Fetch patient data
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    // Fetch recent blood requests
    const recentRequests = await BloodRequest.find({ patientId })
      .populate('hospitalId', 'name city state')
      .sort({ requestDate: -1 })
      .limit(5);
    
    // Return patient dashboard data
    res.json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.emailId,
        phone: patient.phoneNumber,
        age: patient.age,
        medicalCondition: patient.medicalCondition
      },
      recentRequests
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  }
});

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

// Endpoint to get patient profile data
patientRouter.get("/profile", async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication token is required" 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const patientId = decoded.id;
    
    // Fetch patient profile data
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    // Return patient profile data
    res.json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.emailId,
        phone: patient.phoneNumber,
        age: patient.age,
        medicalCondition: patient.medicalCondition
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile data"
    });
  }
});

// Endpoint to update patient profile
patientRouter.put("/profile", async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication token is required" 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const patientId = decoded.id;
    
    // Update patient profile data
    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { 
        $set: {
          name: req.body.name,
          phoneNumber: req.body.phone,
          age: req.body.age,
          medicalCondition: req.body.medicalCondition
        } 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }
    
    // Return updated patient profile data
    res.json({
      success: true,
      patient: {
        id: updatedPatient._id,
        name: updatedPatient.name,
        email: updatedPatient.emailId,
        phone: updatedPatient.phoneNumber,
        age: updatedPatient.age,
        medicalCondition: updatedPatient.medicalCondition
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update profile data"
    });
  }
});

export default patientRouter;
