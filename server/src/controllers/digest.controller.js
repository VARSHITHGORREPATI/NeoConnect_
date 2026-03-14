import { DigestPost } from "../models/DigestPost.js";

export const createDigest = async (req, res) => {
  try {
    const { title, summary, content } = req.body;
    const post = await DigestPost.create({ title, summary, content });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create digest post" });
  }
};

export const getDigests = async (req, res) => {
  try {
    const posts = await DigestPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch digest posts" });
  }
};

