import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "./src/models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/resumeAI");
    console.log("Connected to MongoDB");

    const adminEmail = "admin@resumeforge.com";
    const adminPassword = "adminpassword123";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
         existingAdmin.role = "admin";
         await existingAdmin.save();
         console.log("Existing user role updated to admin.");
      } else {
         console.log("Admin user already exists.");
      }
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new User({
        name: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      await newAdmin.save();
      console.log("New admin user created successfully.");
    }
    
    console.log(`\n--- ADMIN CREDENTIALS ---`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`-------------------------\n`);

  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
