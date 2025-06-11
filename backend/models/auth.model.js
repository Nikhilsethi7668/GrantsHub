import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isPaid: {
      type: Boolean,
      default: false, // Tracks if the user has completed the payment
    },
    admin: {
      type: Boolean,
      default: false,
    },
    business: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    stripeCustomerId: {
      type: String, // Stores the unique Stripe customer ID for the user
    },
    lastPaymentDate: {
      type: Date, // Tracks the date of the last payment
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
