import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import aiRoutes from "./routes/ai.js";
import jobsRoutes from "./routes/jobs.js";
import usersRoutes from "./routes/users.js";
import applicationsRoutes from "./routes/applications.js";

import fs from 'fs';
import path from 'path';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Basic route
app.get("/", (req, res) => {
  res.send("ResumeForge AI API is running");
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/applications", applicationsRoutes);


// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is not set. Skipping database connection for now.");
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
