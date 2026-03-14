import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  uploadMinutes,
  listMinutes,
  searchMinutes,
} from "../controllers/minutes.controller.js";

const router = express.Router();

// Secretariat uploads minutes (PDF)
router.post(
  "/",
  authenticate,
  authorize("secretariat", "admin"),
  upload.single("file"),
  uploadMinutes
);

// Public (authenticated staff) can view minutes list
router.get("/", authenticate, listMinutes);

router.get("/search", authenticate, searchMinutes);

export default router;

