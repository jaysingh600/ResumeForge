import express from "express";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to check for admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to verify admin status" });
  }
};

// @route   POST /api/jobs
// @desc    Create a new job (Admin only)
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.userId,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to create job" });
  }
});

// @route   GET /api/jobs
// @desc    Get all open jobs (Accessible by applicants and admins)
router.get("/", async (req, res) => {
  try {
    // Applicants usually just see open jobs, but for now we fetch all open
    const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// @route   GET /api/jobs/all
// @desc    Get all jobs (Admin only - to manage closed ones as well)
router.get("/all", authenticate, isAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the job" });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job (Admin only)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Admin only)
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
});

export default router;
