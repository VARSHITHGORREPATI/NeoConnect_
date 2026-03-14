import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorRole: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    trackingId: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Safety", "Policy", "Facilities", "HR", "Other"],
      required: true,
    },
    department: { type: String, required: true },
    location: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
    description: { type: String, required: true },
    fileUrl: String,
    anonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["New", "Assigned", "In Progress", "Pending", "Resolved", "Escalated"],
      default: "New",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: [noteSchema],
    lastResponseAt: { type: Date },
  },
  { timestamps: true }
);

export const Case = mongoose.model("Case", caseSchema);

