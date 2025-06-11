import express from "express";
import {
  createCheckoutSession,
  checkoutSuccess,
  getUserPayments,
  cancelSubscription,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create checkout session
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

// Handle successful checkout
router.post("/checkout-success", protectRoute, checkoutSuccess);

// Get user's payment history
router.get("/history", protectRoute, getUserPayments);

// Cancel subscription
router.post("/cancel/:paymentId", protectRoute, cancelSubscription);

export default router;
