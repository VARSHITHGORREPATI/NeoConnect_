import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// Secretariat and admin can view analytics
router.get(
  "/",
  authenticate,
  authorize("secretariat", "admin"),
  getAnalytics
);

export default router;

