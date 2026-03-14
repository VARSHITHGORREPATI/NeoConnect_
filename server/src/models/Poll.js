import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: String,
    votes: { type: Number, default: 0 },
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [optionSchema],
    votes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        optionIndex: Number,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Poll = mongoose.model("Poll", pollSchema);

