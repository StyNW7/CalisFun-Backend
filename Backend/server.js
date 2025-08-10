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
  origin: process.env.NODE_ENV === "development" 
    ? "http://localhost:5173" 
    : process.env.FRONTEND_URL
};

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => res.send("Express on Vercel"));
app.use("/api", router);

// Database connection
const connectAndStart = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
    
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

// Vercel serverless handler
const vercelHandler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("Request handling failed:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Start locally if not in production
if (process.env.NODE_ENV !== "production") {
  connectAndStart();
}

// Always export the handler (Vercel will use this in production)
export default vercelHandler;