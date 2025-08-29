import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Order from "@/lib/db/models/order.model";
import User from "@/lib/db/models/user.model";
import Product from "@/lib/db/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Find a real user (admin user)
    const adminUser = await User.findOne({ role: "Admin" });
    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: "No admin user found. Please run npm run seed first.",
        },
        { status: 400 }
      );
    }

    // Create a test order with real user ID
    const testOrder = await Order.create({
      user: adminUser._id, // Use real user ID
      items: [
        {
          product: adminUser._id, // Use user ID as product ID for test
          clientId: "test-client-1",
          name: "محصول تست - کیف چرمی",
          slug: "test-leather-bag",
          image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
          category: "عمومی",
          price: 150000, // 150,000 تومان
          countInStock: 10,
          quantity: 2,
          size: "L",
          color: "قهوه‌ای",
          note: "این یک یادداشت تست است. لطفاً در بسته‌بندی دقت کنید.",
        },
        {
          product: adminUser._id, // Use user ID as product ID for test
          clientId: "test-client-2",
          name: "محصول تست - کفش ورزشی",
          slug: "test-sports-shoe",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          category: "عمومی",
          price: 200000, // 200,000 تومان
          countInStock: 15,
          quantity: 1,
          size: "42",
          color: "سفید",
          note: "کفش باید کاملاً نو باشد. لطفاً جعبه اصلی را هم بگذارید.",
        },
      ],
      shippingAddress: {
        fullName: "احمد محمدی",
        street: "خیابان ولیعصر، پلاک ۱۲۳، طبقه ۲",
        city: "تهران",
        postalCode: "۱۴۳۵۶",
        country: "ایران",
        province: "تهران",
        phone: "۰۹۱۲۳۴۵۶۷۸۹",
      },
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethod: "زرین‌پال",
      paymentResult: {
        id: "test-ref-id-12345",
        status: "completed",
        email_address: "ahmad@example.com",
      },
      itemsPrice: 500000, // 500,000 تومان
      shippingPrice: 50000, // 50,000 تومان
      taxPrice: 25000, // 25,000 تومان
      totalPrice: 575000, // 575,000 تومان
      isPaid: true,
      paidAt: new Date(),
      isDelivered: false,
    });

    return NextResponse.json({
      success: true,
      message: "Test order created successfully",
      order: {
        id: testOrder._id,
        totalPrice: testOrder.totalPrice,
        itemsCount: testOrder.items.length,
        customerName: testOrder.shippingAddress.fullName,
        customerPhone: testOrder.shippingAddress.phone,
        customerAddress: `${testOrder.shippingAddress.street}, ${testOrder.shippingAddress.city}`,
      },
    });
  } catch (error) {
    console.error("Error creating test order:", error);
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

    // Get all orders with user details
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      ordersCount: orders.length,
      orders: orders.map((order) => ({
        id: order._id,
        user: order.user,
        totalPrice: order.totalPrice,
        itemsCount: order.items.length,
        isPaid: order.isPaid,
        createdAt: order.createdAt,
        customerName: order.shippingAddress?.fullName,
        customerPhone: order.shippingAddress?.phone,
        items: order.items.map((item) => ({
          name: item.name,
          note: item.note,
          price: item.price,
          quantity: item.quantity,
        })),
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
