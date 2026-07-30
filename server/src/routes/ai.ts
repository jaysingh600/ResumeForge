import express from "express";
import multer from "multer";
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import OpenAI from "openai";
import jwt from "jsonwebtoken";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

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

router.post("/parse", authenticate, upload.single("resume"), async (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!process.env.OPENAI_API_KEY) {
      // Return a mock parsed resume for testing purposes
      return res.json({
        personalInfo: {
          fullName: "Mock User (No API Key)",
          email: "test@example.com",
          phone: "123-456-7890",
          address: "Mock City, ST",
          linkedin: "linkedin.com/in/mock",
          github: "github.com/mock",
          portfolio: ""
        },
        summary: "This is a mocked professional summary because the OpenAI API key is missing. The system successfully read the file but used mock data for the JSON parsing.",
        skills: ["React", "Node.js", "TypeScript", "Tailwind CSS"],
        education: [
          { institution: "Mock University", degree: "B.S. Computer Science", startDate: "2018", endDate: "2022" }
        ],
        experience: [
          { company: "Mock Corp", position: "Software Engineer", startDate: "2022", endDate: "Present", description: "- Mocked bullet point 1\n- Mocked bullet point 2" }
        ],
        projects: []
      });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    let extractedText = "";

    if (mimeType === "application/pdf") {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text;
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = docxData.value;
    } else {
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
  } catch (error) {
    console.error("Parse Error:", error);
    res.status(500).json({ message: "Failed to parse resume" });
  }
});

router.post("/optimize", authenticate, async (req: any, res: any) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.json({ optimizedText: "[Mocked Optimization] " + req.body.content });
    }

    const { type, content } = req.body;
    let prompt = "";

    if (type === "summary") {
      prompt = `Rewrite the following professional summary to be more ATS-friendly, impactful, and concise. Return only the rewritten text.\n\n${content}`;
    } else if (type === "experience") {
      prompt = `Rewrite the following job description bullet points to start with strong action verbs, quantify achievements where possible, and be highly ATS-friendly. Return only the rewritten text.\n\n${content}`;
    } else {
      return res.status(400).json({ message: "Invalid optimization type" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ optimizedText: response.choices[0].message.content?.trim() });
  } catch (error) {
    res.status(500).json({ message: "Failed to optimize content" });
  }
});

export default router;
