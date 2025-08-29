import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/lib/db/models/order.model";
import User from "@/lib/db/models/user.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Find any user (preferably admin)
    const anyUser = await User.findOne();
    if (!anyUser) {
      return NextResponse.json(
        {
          success: false,
          error: "No users found in database",
        },
        { status: 400 }
      );
    }

    // Create a realistic test order
    const testOrder = await Order.create({
      user: anyUser._id,
      items: [
        {
          product: anyUser._id, // Using user ID as product ID for test
          clientId: "test-order-001",
          name: "لپ‌تاپ گیمینگ ASUS ROG",
          slug: "asus-rog-gaming-laptop",
          image:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
          category: "الکترونیک",
          price: 25000000, // 25,000,000 تومان
          countInStock: 5,
          quantity: 1,
          size: "15.6 inch",
          color: "مشکی",
          note: "لطفاً لپ‌تاپ را با دقت بسته‌بندی کنید. باتری باید کاملاً شارژ باشد.",
        },
      ],
      shippingAddress: {
        fullName: "فاطمه احمدی",
        street: "بلوار کشاورز، پلاک ۴۵۶، واحد ۸",
        city: "تهران",
        postalCode: "۱۴۱۵۵",
        country: "ایران",
        province: "تهران",
        phone: "۰۹۸۷۶۵۴۳۲۱۰",
      },
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      paymentMethod: "زرین‌پال",
      paymentResult: {
        id: "zarinpal-ref-98765",
        status: "completed",
        email_address: "fateme@example.com",
      },
      itemsPrice: 25000000,
      shippingPrice: 0, // Free shipping
      taxPrice: 1250000, // 5% tax
      totalPrice: 26250000,
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
    });

    console.log("✅ Test order created successfully:", testOrder._id);

    return NextResponse.json({
      success: true,
      message: "Test order created successfully",
      orderId: testOrder._id,
      order: {
        id: testOrder._id,
        totalPrice: testOrder.totalPrice,
        itemsCount: testOrder.items.length,
        customerName: testOrder.shippingAddress.fullName,
        customerPhone: testOrder.shippingAddress.phone,
        customerAddress: `${testOrder.shippingAddress.street}, ${testOrder.shippingAddress.city}`,
        items: testOrder.items.map((item) => ({
          name: item.name,
          note: item.note,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  } catch (error) {
    console.error("❌ Error creating test order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test order",
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
