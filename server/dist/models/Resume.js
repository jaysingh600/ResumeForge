"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resume = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ResumeSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled Resume" },
    personalInfo: {
        fullName: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        address: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
    },
    summary: { type: String, default: "" },
    skills: [{ type: String }],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            fieldOfStudy: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            description: { type: String },
        },
    ],
    experience: [
        {
            company: { type: String },
            position: { type: String },
            location: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            description: { type: String },
        },
    ],
    projects: [
        {
            name: { type: String },
            description: { type: String },
            technologies: [{ type: String }],
            link: { type: String },
        },
    ],
    certifications: [
        {
            name: { type: String },
            issuer: { type: String },
            date: { type: String },
        },
    ],
    achievements: [{ type: String }],
    languages: [{ type: String }],
    interests: [{ type: String }],
    template: { type: String, default: "Modern ATS" },
}, { timestamps: true });
exports.Resume = mongoose_1.default.model("Resume", ResumeSchema);
