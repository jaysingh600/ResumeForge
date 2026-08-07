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
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
