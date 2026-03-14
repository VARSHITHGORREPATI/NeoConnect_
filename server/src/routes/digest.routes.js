import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  createDigest,
  getDigests,
} from "../controllers/digest.controller.js";

const router = express.Router();

// Secretariat or admin can create digest posts
router.post(
  "/",
  authenticate,
  authorize("secretariat", "admin"),
  createDigest
);

// All authenticated staff can view digests
router.get("/", authenticate, getDigests);

export default router;

