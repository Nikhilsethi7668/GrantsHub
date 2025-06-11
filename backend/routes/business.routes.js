import express from "express";

import { fillBusinessForm, getBusinessForm, editBusinessForm } from "../controllers/business.controller.js";
import { protectRoute} from "../middleware/auth.middleware.js";
import { businessValidationRules, editBusinessValidationRules } from "../validators/business.validator.js";

const router = express.Router();


router.get("/:id", protectRoute,getBusinessForm);
router.post("/business-form/:id",protectRoute, fillBusinessForm);
router.put("/edit-business-form/:id",protectRoute,editBusinessValidationRules, editBusinessForm);
export default router;