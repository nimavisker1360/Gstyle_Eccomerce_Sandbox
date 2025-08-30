import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/db/models/user.model";
import { generateToken } from "@/lib/utils";
import { sendEmail, generatePasswordResetEmail } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "ایمیل الزامی است" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json(
        {
          success: true,
          message:
            "اگر ایمیل در سیستم ثبت شده باشد، لینک بازنشانی ارسال خواهد شد",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset password URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Generate email HTML
    const emailHtml = generatePasswordResetEmail(resetUrl, user.name);

    // Send email
    const emailSent = await sendEmail({
      to: email,
      subject: "بازنشانی رمز عبور - GStyle",
      html: emailHtml,
    });

    if (!emailSent) {
      // If email fails, remove the token and return error
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return NextResponse.json(
        {
          success: false,
          error: "خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "لینک بازنشانی رمز عبور ارسال شد",
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در سرور" },
      { status: 500 }
    );
  }
}
