import { Poll } from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await Poll.create({
      question,
      options: options.map((o) => ({ label: o })),
      createdBy: req.user.id,
    });
    res.status(201).json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create poll" });
  }
};

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch polls" });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    const alreadyVoted = poll.votes.some(
      (v) => v.user.toString() === req.user.id.toString()
    );
    if (alreadyVoted) {
      return res.status(400).json({ message: "User has already voted" });
    }

    if (!poll.options[optionIndex]) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.options[optionIndex].votes += 1;
    poll.votes.push({ user: req.user.id, optionIndex });
    await poll.save();

    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

