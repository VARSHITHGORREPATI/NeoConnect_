import cron from "node-cron";
import { Case } from "../models/Case.js";
import { User } from "../models/User.js";

const isOlderThan7WorkingDays = (fromDate) => {
  if (!fromDate) return false;
  const now = new Date();
  let days = 0;
  let d = new Date(fromDate);
  while (d < now && days < 30) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      days += 1;
    }
    d.setDate(d.getDate() + 1);
  }
  return days >= 7;
};

export const initEscalationCron = () => {
  // Run every day at 08:00
  cron.schedule("0 8 * * *", async () => {
    try {
      const cases = await Case.find({
        status: { $in: ["Assigned", "In Progress", "Pending"] },
      }).populate("assignedTo");

      for (const c of cases) {
        const referenceDate = c.lastResponseAt || c.updatedAt || c.createdAt;
        if (isOlderThan7WorkingDays(referenceDate)) {
          c.status = "Escalated";
          await c.save();

          // In a real system we would send emails or push notifications.
          // Here we just log to server console as a stand‑in.
          console.log(
            `Case ${c.trackingId} escalated due to inactivity. Assigned manager: ${
              c.assignedTo?.email || "N/A"
            }`
          );

          const management = await User.find({ role: "secretariat" }).lean();
          management.forEach((m) => {
            console.log(
              `Notify management (${m.email}) about escalation of case ${c.trackingId}`
            );
          });
        }
      }
    } catch (err) {
      console.error("Escalation cron error", err);
    }
  });
};

