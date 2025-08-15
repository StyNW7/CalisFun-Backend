import mongoose from "mongoose";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const dummyUsers = [
  {
    username: "tes",
    email: "test@gmail.com",
    number: "08123456789",
    password: "tes",
    role: "user",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    for (const userData of dummyUsers) {
      await User.create(userData);
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
