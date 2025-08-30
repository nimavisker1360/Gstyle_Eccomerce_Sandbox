import { Resend } from "resend";
import nodemailer from "nodemailer";
import PurchaseReceiptEmail from "./purchase-receipt";
import AdminOrderNotificationEmail from "./admin-order-notification";
import ZarinPalInvoiceEmail from "./zarinpal-invoice";
import { IOrder } from "@/lib/db/models/order.model";
import { ITransaction } from "@/lib/db/models/transaction.model";
import {
  SENDER_EMAIL,
  SENDER_NAME,
  ADMIN_EMAIL,
  SERVER_URL,
} from "@/lib/constants";
import { formatId, formatToman } from "@/lib/utils";

export const sendPurchaseReceipt = async ({ order }: { order: IOrder }) => {
  try {
    // Ensure order and user data exist
    if (!order) {
      throw new Error("Order is required");
    }

    // Handle user field properly - it could be populated or just an ObjectId
    let userEmail = "";
    if (
      typeof order.user === "object" &&
      order.user !== null &&
      "email" in order.user
    ) {
      userEmail = (order.user as any).email;
    } else {
      throw new Error("User email not found in order");
    }

    if (!userEmail) {
      throw new Error("User email is empty");
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY missing. Skipping purchase receipt email.");
      return;
    }
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: userEmail,
      subject: `Order ${formatId(order._id)} Confirmation`,
      react: <PurchaseReceiptEmail order={order} />,
    });
  } catch (error) {
    console.error("Failed to send purchase receipt email:", error);
    throw error;
  }
};

export const sendAdminOrderNotification = async ({
  order,
}: {
  order: IOrder;
}) => {
  try {
    if (!order) {
      throw new Error("Order is required");
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "RESEND_API_KEY missing. Skipping admin notification email."
      );
      return;
    }

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `سفارش جدید - ${formatId(order._id)}`,
      react: <AdminOrderNotificationEmail order={order} />,
    });
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    throw error;
  }
};

// تابع تولید HTML برای ایمیل فاکتور زرین‌پال
const generateZarinPalInvoiceHTML = async ({
  transaction,
  refId,
  authority,
}: {
  transaction: ITransaction;
  refId: string | number;
  authority: string;
}) => {
  const orderId = transaction.orderId || "نامشخص";
  const createdAt = new Date(transaction.createdAt).toLocaleDateString("fa-IR");
  const amountRial = transaction.amount || 0;
  const amountToman = Math.floor(amountRial / 10);
  const fullName =
    `${transaction.customer?.firstName || ""} ${
      transaction.customer?.lastName || ""
    }`.trim() || "نامشخص";
  const customerEmail = transaction.customer?.email || "";
  const customerPhone = transaction.customer?.phone || "";
  const customerAddress = transaction.customer?.address || "";
  const products = transaction.products || [];

  // تولید HTML محصولات
  const productsHTML = products
    .map((product) => {
      const productPriceRial = product.price || 0;
      const productPriceToman = Math.floor(productPriceRial / 10);
      const totalProductPriceToman =
        productPriceToman * (product.quantity || 1);
      const productImage = product.image?.startsWith("/")
        ? `${SERVER_URL}${product.image}`
        : product.image || "https://via.placeholder.com/80";

      return `
        <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white;">
          <div style="display: flex; gap: 16px;">
            <div style="width: 80px; height: 80px; flex-shrink: 0;">
              <img src="${productImage}" alt="${product.name}" 
                   style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;" />
            </div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${product.name}</h3>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">تعداد:</span>
                <span style="font-weight: 600;">${product.quantity}</span>
              </div>
              
              ${
                product.size
                  ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-size: 14px;">سایز:</span>
                  <span style="font-weight: 600;">${product.size}</span>
                </div>
              `
                  : ""
              }
              
              ${
                product.color
                  ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-size: 14px;">رنگ:</span>
                  <span style="font-weight: 600;">${product.color}</span>
                </div>
              `
                  : ""
              }
              
              ${
                product.note
                  ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-size: 14px;">توضیحات:</span>
                  <span style="font-weight: 600; color: #3b82f6;">${product.note}</span>
                </div>
              `
                  : ""
              }
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">قیمت واحد:</span>
                <span style="font-weight: 600;">${formatToman(productPriceToman)}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280; font-size: 14px;">قیمت کل:</span>
                <span style="font-weight: bold; color: #059669;">${formatToman(totalProductPriceToman)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاکتور پرداخت موفق</title>
      <style>
        body {
          font-family: 'Tahoma', 'Arial', sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f9fafb;
          color: #1f2937;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 8px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .section {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        .section:last-child {
          border-bottom: none;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 16px 0;
          text-align: center;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px 0;
        }
        .info-label {
          color: #6b7280;
          font-size: 14px;
        }
        .info-value {
          font-weight: 600;
          color: #1f2937;
        }
        .total-section {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 1px solid #10b981;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 16px 0;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #059669;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 20px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>✅ پرداخت موفق</h1>
          <p>سفارش شما با موفقیت ثبت و پرداخت شد</p>
        </div>

        <!-- Order Info -->
        <div class="section">
          <h2 class="section-title">📋 اطلاعات سفارش</h2>
          <div class="info-row">
            <span class="info-label">شماره سفارش:</span>
            <span class="info-value">${orderId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">تاریخ سفارش:</span>
            <span class="info-value">${createdAt}</span>
          </div>
          <div class="info-row">
            <span class="info-label">کد رهگیری زرین‌پال:</span>
            <span class="info-value" style="font-family: monospace;">${authority}</span>
          </div>
          <div class="info-row">
            <span class="info-label">شماره تراکنش:</span>
            <span class="info-value" style="font-family: monospace;">${refId}</span>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="section">
          <h2 class="section-title">👤 اطلاعات مشتری</h2>
          <div class="info-row">
            <span class="info-label">نام و نام خانوادگی:</span>
            <span class="info-value">${fullName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ایمیل:</span>
            <span class="info-value">${customerEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">شماره تلفن:</span>
            <span class="info-value">${customerPhone}</span>
          </div>
          <div class="info-row">
            <span class="info-label">آدرس:</span>
            <span class="info-value">${customerAddress}</span>
          </div>
        </div>

        <!-- Products -->
        <div class="section">
          <h2 class="section-title">🛍️ محصولات سفارش شده</h2>
          ${productsHTML}
        </div>

        <!-- Total -->
        <div class="section">
          <div class="total-section">
            <div style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">
              جمع کل سفارش:
            </div>
            <div class="total-amount">${formatToman(amountToman)}</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>این ایمیل به صورت خودکار پس از تایید پرداخت ارسال شده است</p>
          <p>در صورت بروز مشکل، با پشتیبانی تماس بگیرید</p>
          <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">
            © 2024 GStyle. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendZarinPalInvoiceEmail = async ({
  transaction,
  refId,
  authority,
}: {
  transaction: ITransaction;
  refId: string | number;
  authority: string;
}) => {
  try {
    if (!transaction) {
      throw new Error("Transaction is required");
    }

    const customerEmail = transaction.customer?.email;
    if (!customerEmail) {
      console.warn(
        "Customer email not found in transaction, skipping invoice email"
      );
      return;
    }

    const gmailUser = "golnazef1360@gmail.com";
    const gmailPass = process.env.EMAIL_APP_PASSWORD;
    if (!gmailPass) {
      console.warn(
        "EMAIL_APP_PASSWORD missing. Skipping ZarinPal invoice email."
      );
      return;
    }

    // استفاده از nodemailer برای ارسال ایمیل از طریق Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // ایجاد HTML برای ایمیل
    const html = await generateZarinPalInvoiceHTML({
      transaction,
      refId,
      authority,
    });

    await transporter.sendMail({
      from: `"GStyle" <${gmailUser}>`,
      to: customerEmail,
      subject: `فاکتور پرداخت موفق - سفارش ${transaction.orderId || "نامشخص"}`,
      html,
    });

    console.log(`ZarinPal invoice email sent successfully to ${customerEmail}`);
  } catch (error) {
    console.error("Failed to send ZarinPal invoice email:", error);
    throw error;
  }
};
