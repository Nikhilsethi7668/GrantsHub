import express from "express";
//import { getGrants } from '../controllers/grants.controller.js'; // Adjust path as needed
import {
  getGrants,
} from "../controllers/grants.controller.js"; // Adjust path as needed

import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();

// Define routes
// router.post("/upload", uploadGrants);
router.get("/recommended-grants/:id", getGrants);
// router.patch("/add-new-grants", protectRoute, isAdmin, addNewgrants);
// router.delete("/delete-grants", protectRoute, isAdmin, deleteGrants);
// router.get("/recommend-grants/:id", protectRoute, recommendGrants);

// router.post("/save-grants/:id", protectRoute, saveGrants);
// router.get("/saved-grants/:id", protectRoute, getSavedGrants);

// router.post("/save-grants/:id", protectRoute, saveGrants);

export default router;
