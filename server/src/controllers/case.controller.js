import path from "path";
import { Case } from "../models/Case.js";
import { generateTrackingId } from "../utils/trackingId.js";

export const createCase = async (req, res) => {
  try {
    const { category, department, location, severity, description, anonymous } = req.body;
    const trackingId = await generateTrackingId();

    let fileUrl;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const payload = {
      trackingId,
      category,
      department,
      location,
      severity,
      description,
      fileUrl,
      anonymous: anonymous === "true" || anonymous === true,
    };

    const newCase = await Case.create(payload);
    res.status(201).json(newCase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create case" });
  }
};

export const getCases = async (req, res) => {
  try {
    const { status, category, department, assignedTo, trackingId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (department) filter.department = department;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (trackingId) filter.trackingId = trackingId;

    const cases = await Case.find(filter)
      .populate("assignedTo", "name email department")
      .sort({ createdAt: -1 });

    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cases" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id).populate(
      "assignedTo",
      "name email department"
    );
    if (!c) return res.status(404).json({ message: "Case not found" });
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch case" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const { status, note } = req.body;
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Case not found" });

    if (status) c.status = status;
    if (note) {
      c.notes.push({
        author: req.user.id,
        authorRole: req.user.role,
        message: note,
        createdAt: new Date(),
      });
      c.lastResponseAt = new Date();
    }

    await c.save();
    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update case" });
  }
};

export const assignCase = async (req, res) => {
  try {
    const { caseId, managerId } = req.body;
    const c = await Case.findById(caseId);
    if (!c) return res.status(404).json({ message: "Case not found" });

    c.assignedTo = managerId;
    c.status = "Assigned";
    await c.save();

    res.json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign case" });
  }
};

