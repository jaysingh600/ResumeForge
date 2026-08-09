import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    academics: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    skills: { type: String, default: "" },
    certifications: { type: String, default: "" },
    interests: { type: String, default: "" },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
