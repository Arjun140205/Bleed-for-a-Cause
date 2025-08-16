import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = {
      id: decoded.id,
      userType: decoded.userType
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

// Data sanitization middleware
export const sanitizeResponse = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (data?.patient || data?.user) {
      // Sanitize sensitive medical data
      const sanitized = sanitizeData(data);
      return originalJson.call(this, sanitized);
    }
    return originalJson.call(this, data);
  };
  next();
};

// Utility function to sanitize sensitive data
const sanitizeData = (data) => {
  const sanitized = { ...data };
  
  if (sanitized.patient) {
    sanitized.patient = sanitizePatientData(sanitized.patient);
  }
  if (sanitized.user) {
    sanitized.user = sanitizeUserData(sanitized.user);
  }
  
  return sanitized;
};

const sanitizePatientData = (patient) => {
  const { password, medicalRecords, ...safeData } = patient;
  return {
    ...safeData,
    medicalCondition: patient.medicalCondition ? "Present" : "None",
    hasMedicalRecords: !!medicalRecords
  };
};

const sanitizeUserData = (user) => {
  const { password, ...safeData } = user;
  return safeData;
};
