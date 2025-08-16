import mongoose from "mongoose";
import validator from "validator";

const donorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
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
        if (
          !validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          })
        ) {
          throw new Error("Password must be strong (A-Z, a-z, 0-9, symbol)");
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
    bloodType: {
      type: String,
      maxLength: 3,
      lowercase: true,
      enum: {
        values: ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"],
        message: `{VALUE} is not valid`,
      },
    },
    age: {
      type: Number,
      max: 100,
      required: true,
    },
    state: {
      type: String,
      default: "",
    },
    district: {
      type: String,
      default: "",
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    isEligibleToDonate: {
      type: Boolean,
      default: true,
    },
    donationFrequency: {
      type: Number, // Number of donations in the last year
      default: 0,
    },
    notificationPreferences: {
      smsEnabled: {
        type: Boolean,
        default: false
      },
      emailEnabled: {
        type: Boolean,
        default: false
      },
      radius: {
        type: Number,
        default: 10, // Default radius in kilometers
        min: 1,
        max: 50
      }
    },
    medicalCondition: {
      type: String,
      default: "",
      minLength: 0,
      maxLength: 100,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },
    address: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for donations
donorSchema.virtual('donations', {
  ref: 'BloodDonation',
  localField: '_id',
  foreignField: 'donorId'
});

// Ensure virtuals are included when converting to JSON
donorSchema.set('toJSON', { virtuals: true });
donorSchema.set('toObject', { virtuals: true });

const Donor = new mongoose.model("Donor", donorSchema);

export default Donor;
