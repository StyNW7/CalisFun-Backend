import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:5173", process.env.FRONTEND_URL
  ]
};

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/api", router);

// Database connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

// Start server in dev mode
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel serverless
export default async (req, res) => {
  await startServer();
  return app(req, res);
};