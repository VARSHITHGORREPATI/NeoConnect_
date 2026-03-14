import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  assignCase,
} from "../controllers/case.controller.js";

const router = express.Router();

// Staff submit case (with optional file)
router.post(
  "/",
  authenticate,
  authorize("staff", "secretariat", "case_manager", "admin"),
  upload.single("file"),
  createCase
);

// List cases - staff see own cases, others depend on role (handled in controller or via query)
router.get("/", authenticate, getCases);

router.get("/:id", authenticate, getCaseById);

// Case manager / secretariat update status, add notes
router.patch(
  "/:id",
  authenticate,
  authorize("secretariat", "case_manager", "admin"),
  updateCase
);

// Secretariat assigns cases
router.post(
  "/assign",
  authenticate,
  authorize("secretariat", "admin"),
  assignCase
);

export default router;

