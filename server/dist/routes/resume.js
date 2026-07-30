"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Resume_1 = require("../models/Resume");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
// Middleware to authenticate
const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token)
        return res.status(401).json({ message: "No token, authorization denied" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
// Create a new resume
router.post("/create", authenticate, async (req, res) => {
    try {
        const resume = new Resume_1.Resume({
            userId: req.userId,
            ...req.body,
        });
        await resume.save();
        res.status(201).json(resume);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create resume" });
    }
});
// Get all resumes for user
router.get("/", authenticate, async (req, res) => {
    try {
        const resumes = await Resume_1.Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch resumes" });
    }
});
// Get single resume
router.get("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume_1.Resume.findOne({ _id: req.params.id, userId: req.userId });
        if (!resume)
            return res.status(404).json({ message: "Resume not found" });
        res.json(resume);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch resume" });
    }
});
// Update resume
router.put("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume_1.Resume.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
        if (!resume)
            return res.status(404).json({ message: "Resume not found" });
        res.json(resume);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update resume" });
    }
});
// Delete resume
router.delete("/:id", authenticate, async (req, res) => {
    try {
        const resume = await Resume_1.Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!resume)
            return res.status(404).json({ message: "Resume not found" });
        res.json({ message: "Resume deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete resume" });
    }
});
exports.default = router;
