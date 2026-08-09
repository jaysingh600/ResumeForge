"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new User_1.User({ name, email, password: hashedPassword });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "7d",
        });
        res.status(201).json({ token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                academics: user.academics,
                location: user.location,
                bio: user.bio,
                linkedin: user.linkedin,
                github: user.github,
                portfolio: user.portfolio,
                skills: user.skills,
                certifications: user.certifications,
                interests: user.interests,
                education: user.education,
                experience: user.experience,
                projects: user.projects
            } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "7d",
        });
        res.json({ token, user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                academics: user.academics,
                location: user.location,
                bio: user.bio,
                linkedin: user.linkedin,
                github: user.github,
                portfolio: user.portfolio,
                skills: user.skills,
                certifications: user.certifications,
                interests: user.interests,
                education: user.education,
                experience: user.experience,
                projects: user.projects
            } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});
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
router.put("/profile", authenticate, async (req, res) => {
    try {
        const { name, phone, academics, location, bio, linkedin, github, portfolio, skills, certifications, interests, education, experience, projects } = req.body;
        const user = await User_1.User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (name)
            user.name = name;
        if (phone !== undefined)
            user.phone = phone;
        if (academics !== undefined)
            user.academics = academics;
        if (location !== undefined)
            user.location = location;
        if (bio !== undefined)
            user.bio = bio;
        if (linkedin !== undefined)
            user.linkedin = linkedin;
        if (github !== undefined)
            user.github = github;
        if (portfolio !== undefined)
            user.portfolio = portfolio;
        if (skills !== undefined)
            user.skills = skills;
        if (certifications !== undefined)
            user.certifications = certifications;
        if (interests !== undefined)
            user.interests = interests;
        if (education !== undefined)
            user.education = education;
        if (experience !== undefined)
            user.experience = experience;
        if (projects !== undefined)
            user.projects = projects;
        await user.save();
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phone: user.phone,
                academics: user.academics,
                location: user.location,
                bio: user.bio,
                linkedin: user.linkedin,
                github: user.github,
                portfolio: user.portfolio,
                skills: user.skills,
                certifications: user.certifications,
                interests: user.interests,
                education: user.education,
                experience: user.experience,
                projects: user.projects
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating profile" });
    }
});
exports.default = router;
