"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const pdfParse = require("pdf-parse");
const mammoth_1 = __importDefault(require("mammoth"));
const openai_1 = __importDefault(require("openai"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});
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
router.post("/parse", authenticate, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "No file uploaded" });
        if (!process.env.OPENAI_API_KEY)
            return res.status(500).json({ message: "OpenAI API Key is not configured." });
        const fileBuffer = req.file.buffer;
        const mimeType = req.file.mimetype;
        let extractedText = "";
        if (mimeType === "application/pdf") {
            const pdfData = await pdfParse(fileBuffer);
            extractedText = pdfData.text;
        }
        else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimeType === "application/msword") {
            const docxData = await mammoth_1.default.extractRawText({ buffer: fileBuffer });
            extractedText = docxData.value;
        }
        else {
            return res.status(400).json({ message: "Unsupported file type. Please upload PDF or DOCX." });
        }
        // Call OpenAI
        const prompt = `Extract all possible resume details from the following text and return ONLY valid JSON matching this structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "address": "", "linkedin": "", "github": "", "portfolio": "" },
  "summary": "",
  "skills": [],
  "education": [{ "institution": "", "degree": "", "startDate": "", "endDate": "" }],
  "experience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "description": "" }],
  "projects": [{ "name": "", "description": "", "technologies": [] }]
}
Text to extract from:
${extractedText}
`;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });
        const parsedData = JSON.parse(response.choices[0].message.content || "{}");
        res.json(parsedData);
    }
    catch (error) {
        console.error("Parse Error:", error);
        res.status(500).json({ message: "Failed to parse resume" });
    }
});
router.post("/optimize", authenticate, async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY)
            return res.status(500).json({ message: "OpenAI API Key is not configured." });
        const { type, content } = req.body;
        let prompt = "";
        if (type === "summary") {
            prompt = `Rewrite the following professional summary to be more ATS-friendly, impactful, and concise. Return only the rewritten text.\n\n${content}`;
        }
        else if (type === "experience") {
            prompt = `Rewrite the following job description bullet points to start with strong action verbs, quantify achievements where possible, and be highly ATS-friendly. Return only the rewritten text.\n\n${content}`;
        }
        else {
            return res.status(400).json({ message: "Invalid optimization type" });
        }
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });
        res.json({ optimizedText: response.choices[0].message.content?.trim() });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to optimize content" });
    }
});
exports.default = router;
