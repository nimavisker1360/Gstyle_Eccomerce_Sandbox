import { Resend } from "resend";
import PurchaseReceiptEmail from "./purchase-receipt";
import AdminOrderNotificationEmail from "./admin-order-notification";
import { IOrder } from "@/lib/db/models/order.model";
import { SENDER_EMAIL, SENDER_NAME, ADMIN_EMAIL } from "@/lib/constants";
import { formatId } from "@/lib/utils";

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
