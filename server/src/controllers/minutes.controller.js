import { Minutes } from "../models/Minutes.js";

export const uploadMinutes = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });
    const { title } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const minutes = await Minutes.create({
      title,
      fileUrl,
      uploadedBy: req.user.id,
    });
    res.status(201).json(minutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload minutes" });
  }
};

export const listMinutes = async (req, res) => {
  try {
    const minutes = await Minutes.find().sort({ createdAt: -1 });
    res.json(minutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch minutes" });
  }
};

export const searchMinutes = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          title: {
            $regex: q,
            $options: "i",
          },
        }
      : {};

    const minutes = await Minutes.find(filter).sort({ createdAt: -1 });
    res.json(minutes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to search minutes" });
  }
};

