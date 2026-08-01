import express from "express";
import { Resume } from "../models/Resume";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to authenticate
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Create a new resume
router.post("/create", authenticate, async (req: any, res: any) => {
  try {
    const resume = new Resume({
      userId: req.userId,
      ...req.body,
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to create resume" });
  }
});

// Get all resumes for user
router.get("/", authenticate, async (req: any, res: any) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
});

// Get single resume
router.get("/:id", authenticate, async (req: any, res: any) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume" });
  }
});

// Update resume
router.put("/:id", authenticate, async (req: any, res: any) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to update resume" });
  }
});

// Delete resume
router.delete("/:id", authenticate, async (req: any, res: any) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resume" });
  }
});

export default router;
