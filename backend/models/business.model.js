import mongoose from "mongoose";
import { BUSINESS_TYPES } from '../config/businessTypes.js';

const BusinessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    website: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    headquartered: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: BUSINESS_TYPES,
    },
    summary: {
      type: String,
      default:"not provided"
    },
    keyBusinessGoals: {
      type: [String],
      enum: [
        "Hiring",
        "Internship",
        "Market Expansion",
        "Research and Development",
        "Training",
      ],
      required: true,
    },
    incorporationDate: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{4}$/.test(v) && 
                 parseInt(v) >= 1900 && 
                 parseInt(v) <= new Date().getFullYear();
        },
        message: props => `${props.value} is not a valid year (must be between 1900 and current year)`
      }
    },
    // founderDemographics: {
    //   type: [String],
    //   enum: ["Gender", "Ethnicity", "Age", "Other"],
    // },
    additionalIndustries: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: 'Cannot select more than 5 additional industries'
      }
    },
    founderDemographics: {
      type: [String],
      enum: ["Black", "Female", "LGBTQ+", "Youth", "Veteran", "Newcomer","None"],
      validate: {
        validator: function (v) {
          return v.length <= 6; // Maximum 6 options
        },
        message: 'Cannot select more than 6 founder demographics'
      }
    },
    employeeCount: {
      type: Number,
      required: true,
    },
    annualRevenue: {
      type: Number,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    grantFunding: {
      type: Boolean,
      required: true,
    },
    researchDevelopment: {
      type: Boolean,
    },
    language: {
      type: String,
      required: true,
    },
    payrollSystem: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


export const Business = mongoose.model("Business", BusinessSchema);
