import express from "express";
import multer from "multer";
import path from "path";
import { Application } from "../models/Application.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

// @route   POST /api/applications
// @desc    Apply for a job
router.post("/", authenticate, upload.single("resumeFile"), async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    let resumeFilePath = null;
    if (req.file) {
      resumeFilePath = `/uploads/${req.file.filename}`;
    }

    const application = new Application({
      job: jobId,
      user: req.userId,
      resume: resumeId || null,
      resumeFile: resumeFilePath
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application" });
  }
});

// @route   GET /api/applications/me
// @desc    Get all applications for logged in user
router.get("/me", authenticate, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId })
      .populate("job", "title company location")
      .populate("resume", "title")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your applications" });
  }
});

// @route   GET /api/applications
// @desc    Get all applications (Admin only)
router.get("/", authenticate, isAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email phone avatar")
      .populate("job", "title company location")
      .populate("resume", "title")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status (Admin only)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    )
      .populate("user", "name email phone avatar")
      .populate("job", "title company location")
      .populate("resume", "title");
      
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to update application" });
  }
});

export default router;
