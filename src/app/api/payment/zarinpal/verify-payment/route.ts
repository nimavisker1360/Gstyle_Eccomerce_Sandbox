import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { formatToman, tomanToRial } from "@/lib/utils";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";
import { Invoice } from "@/lib/db/models/invoice.model";
import Cart from "@/lib/db/models/cart.model";
import { auth } from "@/auth";
import {
  sendAdminOrderNotification,
  sendZarinPalInvoiceEmail,
} from "@/emails/index";

// تابع قدیمی - دیگر استفاده نمی‌شود
// function parseRecipientEmails(input?: string | null): string[] {
//   if (!input) return [];
//   return input
//     .split(/[;,]/)
//     .map((e) => e.trim())
//     .filter((e) => e.length > 0);
// }

// تابع قدیمی - دیگر استفاده نمی‌شود
// async function sendInvoiceEmailFromTransaction(params: {
//   transaction: any;
//   refId: string | number;
//   authority: string;
// }) {
//   // ... کد قدیمی
// }

async function ensureInvoiceForTransaction(params: {
  transaction: any;
  refId: string | number;
  authority: string;
}) {
  const { transaction, refId, authority } = params;
  if (!transaction) return null;

  const userId: string | undefined = transaction.userId;
  const orderId: string | undefined = transaction.orderId;
  if (!userId || !orderId) return null;

  // Try to find existing by refId or orderId
  const existingByRef = await Invoice.findOne({ refId: String(refId) });
  if (existingByRef) return existingByRef;
  const existingByOrder = await Invoice.findOne({ orderId: String(orderId) });
  if (existingByOrder) return existingByOrder;

  const doc = await Invoice.create({
    userId: String(userId),
    orderId: String(orderId),
    amount: Number(transaction.amount || 0),
    refId: String(refId),
    authority: String(authority),
    paymentDate: new Date(),
    status: "paid",
    metadata: {
      order_id: String(orderId),
      user_id: String(userId),
      email: transaction?.customer?.email || undefined,
    },
  });
  return doc;
}

// تابع جدید برای دریافت اطلاعات محصولات از سبد خرید
async function getCartProducts(userId: string) {
  try {
    if (!userId) return [];

    const userCart = await Cart.findOne({ user: userId });
    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return [];
    }

    // تبدیل آیتم‌های سبد خرید به فرمت مورد نیاز
    return userCart.items.map((item: any) => ({
      productId: item.product,
      name: item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      note: item.note,
      // اضافه کردن فیلد link
      link: item.link,
    }));
  } catch (error) {
    console.error("Error getting cart products:", error);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Authority, Status, amount, orderId } = body;

    // Force sandbox mode for testing
    const isProduction = false;
    const verifyUrl = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";

    // Validate required fields
    if (!Authority) {
      return NextResponse.json(
        { error: "پارامترهای ضروری ارسال نشده‌اند" },
        { status: 400 }
      );
    }

    if (Status !== "OK") {
      return NextResponse.json(
        { error: "پرداخت توسط کاربر لغو شد." },
        { status: 400 }
      );
    }

    // Fetch stored transaction amount (in Rial) for accurate verification
    await connectToDatabase();
    const existing = await Transaction.findOne({ authority: Authority });
    const amountInRial =
      existing?.amount ?? (amount ? tomanToRial(Number(amount)) : undefined);

    if (!amountInRial) {
      return NextResponse.json(
        { error: "مبلغ تراکنش یافت نشد" },
        { status: 400 }
      );
    }

    const response = await axios.post(verifyUrl, {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amountInRial,
      authority: Authority,
    });

    const { data } = response.data;

    if (data.code === 100) {
      try {
        const session = await auth();
        await Transaction.findOneAndUpdate(
          { authority: Authority },
          {
            userId: session?.user?.id ?? existing?.userId,
            orderId: orderId ?? existing?.orderId,
            status: "completed",
            refId: String(data.ref_id),
            amount: Number(amountInRial),
            // keep any customer info that was saved during create
            customer: existing?.customer ?? undefined,
            // اضافه کردن اطلاعات محصولات از سبد خرید
            products: await getCartProducts(
              session?.user?.id ?? existing?.userId
            ),
            verifiedAt: new Date(),
          },
          { upsert: false }
        );
        const updatedTxn = await Transaction.findOne({ authority: Authority });
        await ensureInvoiceForTransaction({
          transaction: updatedTxn,
          refId: data.ref_id,
          authority: Authority,
        });
        await sendZarinPalInvoiceEmail({
          transaction: updatedTxn,
          refId: data.ref_id,
          authority: Authority,
        });
      } catch (dbErr) {
        console.error(
          "Failed to update transaction after verification:",
          dbErr
        );
      }
      return NextResponse.json({
        success: true,
        refId: data.ref_id,
        message: `✅ پرداخت موفق بود. کد پیگیری: ${data.ref_id}`,
      });
    } else {
      try {
        await Transaction.findOneAndUpdate(
          { authority: Authority },
          { status: "failed" },
          { upsert: false }
        );
      } catch (dbErr) {
        console.error("Failed to mark transaction failed:", dbErr);
      }
      return NextResponse.json(
        {
          success: false,
          error: `❌ خطا در تایید پرداخت: ${data.message}`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Handle GET requests for callback URLs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const Authority = searchParams.get("Authority");
    const Status = searchParams.get("Status");
    const amount = searchParams.get("amount");
    const orderId = searchParams.get("orderId");

    // Force sandbox mode for testing
    const isProduction = false;
    const verifyUrl = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";

    if (Status !== "OK") {
      // mark cancelled
      try {
        await connectToDatabase();
        if (Authority) {
          await Transaction.findOneAndUpdate(
            { authority: Authority },
            { status: "cancelled" },
            { upsert: false }
          );
        }
      } catch (dbErr) {
        console.error("Failed to mark transaction cancelled:", dbErr);
      }
      // Payment failed or was cancelled, redirect to home page
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=failed${amount ? `&amount=${amount}` : ""}`;
      return NextResponse.redirect(failureUrl);
    }

    if (!Authority) {
      return NextResponse.json(
        { error: "پارامترهای ضروری ارسال نشده‌اند" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const txn = await Transaction.findOne({ authority: Authority });
    const amountInRial =
      txn?.amount ?? (amount ? tomanToRial(Number(amount)) : undefined);

    if (!amountInRial) {
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=error&error=${encodeURIComponent("amount not found")}`;
      return NextResponse.redirect(failureUrl);
    }

    const response = await axios.post(verifyUrl, {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amountInRial,
      authority: Authority,
    });

    const { data } = response.data;

    if (data.code === 100) {
      try {
        const session = await auth();
        await Transaction.findOneAndUpdate(
          { authority: Authority },
          {
            userId: session?.user?.id ?? txn?.userId,
            orderId: orderId ?? txn?.orderId,
            status: "completed",
            refId: String(data.ref_id),
            amount: Number(amountInRial),
            customer: txn?.customer ?? undefined,
            // اضافه کردن اطلاعات محصولات از سبد خرید
            products: await getCartProducts(session?.user?.id ?? txn?.userId),
            verifiedAt: new Date(),
          },
          { upsert: false }
        );
        const updatedTxn = await Transaction.findOne({ authority: Authority });
        await ensureInvoiceForTransaction({
          transaction: updatedTxn,
          refId: data.ref_id,
          authority: Authority,
        });
        await sendZarinPalInvoiceEmail({
          transaction: updatedTxn,
          refId: data.ref_id,
          authority: Authority,
        });
      } catch (dbErr) {
        console.error(
          "Failed to update transaction after verification:",
          dbErr
        );
      }
      // Payment verified successfully, redirect to home page
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=success&refId=${data.ref_id}${amountInRial ? `&amount=${amountInRial}` : ""}`;
      return NextResponse.redirect(successUrl);
    } else {
      try {
        await Transaction.findOneAndUpdate(
          { authority: Authority },
          { status: "failed" },
          { upsert: false }
        );
      } catch (dbErr) {
        console.error("Failed to mark transaction failed:", dbErr);
      }
      // Payment verification failed, redirect to home page
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=verification_failed&error=${data.message}${amountInRial ? `&amount=${amountInRial}` : ""}`;
      return NextResponse.redirect(failureUrl);
    }
  } catch (error: any) {
    // Error occurred, redirect to home page
    const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/?payment=error&error=${encodeURIComponent(error.message)}`;
    return NextResponse.redirect(failureUrl);
  }
}
