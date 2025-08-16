import mongoose from "mongoose";
import validator from "validator";

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    bloodStock: {
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 }
    },
    thalassemiaPriorityAlerts: [{
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
      bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      urgencyLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
      requestedAt: { type: Date, default: Date.now }
    }],
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password : " + value);
        }
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      validator(value) {
        if (!validator.isMobilePhone(value, "en-IN")) {
          throw new Error("Phone number is invalid :" + value);
        }
      },
    },
    licenseNumber: {
      type: String,
      maxLength: 30,
      required: true,
    },
    state: {
      type: String,
      minLength: 1,
      maxLength: 50,
      required: true,
    },
    city: {
      type: String,
      minLength: 1,
      maxLength: 50,
      required: true,
    },
    bloodInventory: {
      'A+': { type: Number, default: 0 },
      'A-': { type: Number, default: 0 },
      'B+': { type: Number, default: 0 },
      'B-': { type: Number, default: 0 },
      'AB+': { type: Number, default: 0 },
      'AB-': { type: Number, default: 0 },
      'O+': { type: Number, default: 0 },
      'O-': { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = new mongoose.model("Hospital", hospitalSchema);

export default Hospital;
