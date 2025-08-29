import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, password, and name are required",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user to admin
      user.role = "Admin";
      user.name = name;
      if (password !== "keep") {
        user.password = bcrypt.hashSync(password, 5);
      }
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Existing user updated to admin role",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      // Create new admin user
      const hashedPassword = bcrypt.hashSync(password, 5);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        emailVerified: true,
      });

      return NextResponse.json({
        success: true,
        message: "New admin user created",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
