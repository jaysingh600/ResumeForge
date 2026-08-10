import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: "" },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", JobSchema);
