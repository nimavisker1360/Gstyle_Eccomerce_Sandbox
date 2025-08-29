import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: "Not authenticated",
        session: null,
      });
    }

    await connectToDatabase();

    // Get user from database to check actual role
    const dbUser = await User.findById(session.user.id).select(
      "name email role"
    );

    return NextResponse.json({
      success: true,
      session: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      databaseUser: dbUser
        ? {
            id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          }
        : null,
      isAdmin: session.user.role === "Admin",
      message: "User role debug information",
    });
  } catch (error) {
    console.error("Error in user role debug:", error);
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

