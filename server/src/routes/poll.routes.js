import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import {
  createPoll,
  getPolls,
  votePoll,
} from "../controllers/poll.controller.js";

const router = express.Router();

// Secretariat creates polls
router.post(
  "/",
  authenticate,
  authorize("secretariat", "admin"),
  createPoll
);

// All authenticated users can list polls
router.get("/", authenticate, getPolls);

// Staff vote
router.post(
  "/:id/vote",
  authenticate,
  authorize("staff", "secretariat", "case_manager", "admin"),
  (req, res, next) => {
    // Normalize to controller contract: pollId, optionIndex
    req.body.pollId = req.params.id;
    next();
  },
  votePoll
);

export default router;

