import express from "express";
import {
  forgotPassword,
  login,
  logout,
  signup,
  resetPassword,
  verifyToken,
  verifyemail,
  getAllUsers,
  deleteUser,
 
} from "../controllers/auth.controller.js";
import { isAdmin, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/verify", verifyToken);

router.post("/verify-email",verifyemail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/get-all-users",protectRoute, isAdmin, getAllUsers);

router.delete("/delete-user/:id",protectRoute, isAdmin, deleteUser);

export default router;
