import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // 🛡️ CHECK IF EXISTS FIRST
    const existingAdmin = await User.findOne({ email: "admin@petronas.com" });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists. No action needed.",
        user: { email: existingAdmin.email, role: existingAdmin.role } 
      });
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const newAdmin = await User.create({
      name: "System Admin",
      email: "admin@petronas.com",
      password: hashedPassword,
      role: "admin"
    });

    return NextResponse.json({ 
      message: "Admin created successfully", 
      email: newAdmin.email 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}