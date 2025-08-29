import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status"); // all, pending, completed, failed, cancelled
    const search = searchParams.get("search"); // search by customer name, phone, or authority

    // Build filter object
    const filter: any = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { authority: { $regex: search, $options: "i" } },
        { refId: { $regex: search, $options: "i" } },
        { "customer.firstName": { $regex: search, $options: "i" } },
        { "customer.lastName": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch completed transactions with product information
    const transactions = await Transaction.aggregate([
      { $match: { ...filter, status: "completed" } }, // Only completed transactions
      {
        $project: {
          _id: 1,
          authority: 1,
          refId: 1,
          amount: 1,
          status: 1,
          gateway: 1,
          customer: 1,
          products: 1, // محصولات
          verifiedAt: 1,
          createdAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments({
      ...filter,
      status: "completed",
    });

    // Transform transactions to match the expected order format
    const orders = transactions.map((transaction) => ({
      _id: transaction._id,
      user: {
        _id: transaction.userId || "unknown",
        name:
          `${transaction.customer?.firstName || ""} ${transaction.customer?.lastName || ""}`.trim() ||
          "کاربر ناشناس",
        email: transaction.customer?.email || "ایمیل وارد نشده",
      },
      // استفاده از فیلد products به جای cart
      items: (transaction.products || []).map((item: any) => ({
        ...item,
        // اطمینان از وجود فیلدهای مورد نیاز
        _id: item.productId || item._id || `item-${Math.random()}`,
        category: "عمومی", // فیلد پیش‌فرض
        // حفظ فیلد link برای محصولات خارجی
        link: item.link,
      })),
      shippingAddress: {
        fullName:
          `${transaction.customer?.firstName || ""} ${transaction.customer?.lastName || ""}`.trim() ||
          "نامشخص",
        street: transaction.customer?.address || "آدرس وارد نشده",
        city: "شهر وارد نشده",
        postalCode: "کد پستی وارد نشده",
        country: "ایران",
        province: "استان وارد نشده",
        phone: transaction.customer?.phone || "شماره تماس وارد نشده",
      },
      totalPrice: transaction.amount,
      itemsPrice: transaction.amount,
      shippingPrice: 0,
      taxPrice: 0,
      paymentMethod: "زرین‌پال",
      isPaid: true,
      isDelivered: false,
      createdAt: transaction.createdAt,
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }));

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        pages: Math.ceil(totalTransactions / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
