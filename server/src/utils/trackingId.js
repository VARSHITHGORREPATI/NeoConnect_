import { Counter } from "../models/Counter.js";

export const generateTrackingId = async () => {
  const year = new Date().getFullYear();
  const prefix = `NEO-${year}-`;

  const counterKey = `case_${year}`;
  const counter = await Counter.findOneAndUpdate(
    { key: counterKey },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean();

  const nextNumber = counter.seq || 1;

  const padded = String(nextNumber).padStart(3, "0");
  return `${prefix}${padded}`;
};

