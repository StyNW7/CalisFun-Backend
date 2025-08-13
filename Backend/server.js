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
};

if (process.env.NODE_ENV === "development") {
  corsOptions.origin = "http://localhost:5173";
} else if (process.env.NODE_ENV === "production") {
  corsOptions.origin = "http://beta-indonesia.vercel.app";
}

app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => res.send("Express on Azure App Services"));
app.use("/api", router);

// Database connection and server start
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`Server running on port ${port}`);
      if (process.env.NODE_ENV === "development") {
        console.log(`Access the server at http://localhost:${port}`);
      }
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
};

startServer();