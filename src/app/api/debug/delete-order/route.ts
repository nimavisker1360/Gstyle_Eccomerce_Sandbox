import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/lib/db/models/order.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and delete the order
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    console.log("✅ Order deleted successfully:", orderId);

    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت حذف شد",
      deletedOrder: {
        id: deletedOrder._id,
        customerName: deletedOrder.shippingAddress?.fullName,
        totalPrice: deletedOrder.totalPrice,
      },
    });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Get all orders count
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ isPaid: true });
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        paidOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      message: `Database contains ${totalOrders} orders, ${paidOrders} paid orders`,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

