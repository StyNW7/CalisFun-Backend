import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seedUsers } from "./user.seeder.js";
import { seedReading } from "./reading.seeder.js";
import { seedWriting } from "./writing.seeder.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function seedAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for full seeding.");

    // await seedUsers();
    await seedReading();
    await seedWriting();

    console.log("All data has been seeded successfully!");
  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedAll();
