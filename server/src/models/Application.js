import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: mongoose.Schema.Types.ObjectId, ref: "Resume" },
    resumeFile: { type: String }, // Store path to uploaded PDF
    status: { type: String, enum: ["pending", "reviewed", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", ApplicationSchema);
