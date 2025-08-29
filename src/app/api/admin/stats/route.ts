import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";
import User from "@/lib/db/models/user.model";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Calculate date ranges
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch statistics from transactions
    const [
      totalTransactions,
      totalRevenue,
      totalCustomers,
      pendingTransactions,
      todayTransactions,
      monthlyRevenue,
    ] = await Promise.all([
      // Total completed transactions
      Transaction.countDocuments({ status: "completed" }),

      // Total revenue from completed transactions
      Transaction.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      // Total unique customers
      Transaction.distinct("userId", { status: "completed" }),

      // Pending transactions
      Transaction.countDocuments({ status: "pending" }),

      // Today's completed transactions
      Transaction.countDocuments({
        status: "completed",
        createdAt: { $gte: startOfDay },
      }),

      // Monthly revenue
      Transaction.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // Extract revenue values
    const totalRevenueValue = totalRevenue[0]?.total || 0;
    const monthlyRevenueValue = monthlyRevenue[0]?.total || 0;

    const stats = {
      totalOrders: totalTransactions,
      totalRevenue: totalRevenueValue,
      totalCustomers: totalCustomers.length,
      pendingOrders: pendingTransactions,
      todayOrders: todayTransactions,
      monthlyRevenue: monthlyRevenueValue,
    };

    return NextResponse.json({ success: true, ...stats });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
