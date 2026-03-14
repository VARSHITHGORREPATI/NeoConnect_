import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import caseRoutes from "./routes/case.routes.js";
import pollRoutes from "./routes/poll.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import minutesRoutes from "./routes/minutes.routes.js";
import digestRoutes from "./routes/digest.routes.js";
import userRoutes from "./routes/user.routes.js";

import { initEscalationCron } from "./utils/escalationCron.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/minutes", minutesRoutes);
app.use("/api/digests", digestRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/neoconnect";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
      initEscalationCron();
    });
  })
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

