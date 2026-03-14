import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { listUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

// Admin manages users and roles
router.get(
  "/",
  authenticate,
  authorize("admin"),
  listUsers
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  updateUser
);

export default router;

