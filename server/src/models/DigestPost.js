import mongoose from "mongoose";

const digestPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const DigestPost = mongoose.model("DigestPost", digestPostSchema);

