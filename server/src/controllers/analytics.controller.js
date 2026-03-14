import { Case } from "../models/Case.js";

export const getAnalytics = async (req, res) => {
  try {
    const byDepartment = await Case.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const byCategory = await Case.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const byStatus = await Case.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const hotspotAgg = await Case.aggregate([
      {
        $group: {
          _id: { department: "$department", category: "$category" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gte: 5 } } },
    ]);

    const hotspots = hotspotAgg.map((h) => ({
      department: h._id.department,
      category: h._id.category,
      count: h.count,
    }));

    res.json({
      byDepartment,
      byCategory,
      byStatus,
      hotspots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

