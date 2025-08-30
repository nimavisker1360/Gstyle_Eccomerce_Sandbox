import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "توکن الزامی است" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "توکن بازنشانی نامعتبر یا منقضی شده است" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "توکن معتبر است" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Validate reset token error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در سرور" },
      { status: 500 }
    );
  }
}
