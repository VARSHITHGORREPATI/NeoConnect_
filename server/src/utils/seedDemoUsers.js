import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/neoconnect";
const DEFAULT_PASSWORD = process.env.DEMO_PASSWORD || "Password123!";

const firstNames = [
  "Asha",
  "Kiran",
  "Neha",
  "Ravi",
  "Sana",
  "Ishaan",
  "Meera",
  "Dev",
  "Tara",
  "Kabir",
  "Anaya",
  "Rohan",
  "Nikhil",
  "Pooja",
  "Farah",
  "Arjun",
  "Diya",
  "Vikram",
  "Zoya",
  "Reyansh",
];

const lastNames = [
  "Sharma",
  "Patel",
  "Singh",
  "Iyer",
  "Khan",
  "Gupta",
  "Mehta",
  "Nair",
  "Das",
  "Reddy",
  "Kapoor",
  "Joshi",
  "Bose",
  "Malik",
  "Choudhary",
];

const departments = [
  "HR",
  "Facilities",
  "Safety",
  "Operations",
  "Finance",
  "Engineering",
  "Sales",
  "Support",
  "Legal",
  "Administration",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeName = () => `${pick(firstNames)} ${pick(lastNames)}`;

const makeDepartment = () => pick(departments);

const rolePrefix = (role) => {
  if (role === "staff") return "staff";
  if (role === "secretariat") return "mgmt";
  if (role === "case_manager") return "cm";
  return "user";
};

async function seedRole(role, count) {
  const prefix = rolePrefix(role);

  const created = [];
  for (let i = 1; i <= count; i++) {
    const email = `${prefix}${String(i).padStart(2, "0")}@neoconnect.demo`;
    const exists = await User.findOne({ email }).lean();
    if (exists) continue;

    const user = await User.create({
      name: makeName(),
      email,
      password: DEFAULT_PASSWORD,
      role,
      department: makeDepartment(),
    });
    created.push({ id: user._id.toString(), email: user.email, role: user.role });
  }
  return created;
}

async function main() {
  await mongoose.connect(MONGO_URI);

  const roles = ["staff", "secretariat", "case_manager"];
  const results = {};

  for (const role of roles) {
    results[role] = await seedRole(role, 10);
  }

  console.log("Demo users seeded (skips existing emails).");
  console.log(`Default password for all demo accounts: ${DEFAULT_PASSWORD}`);
  console.log("Login emails:");
  for (const role of roles) {
    const prefix = rolePrefix(role);
    console.log(`- ${role}: ${prefix}01@neoconnect.demo ... ${prefix}10@neoconnect.demo`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

