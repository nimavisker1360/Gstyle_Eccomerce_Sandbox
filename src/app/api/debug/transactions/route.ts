import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";
import Cart from "@/lib/db/models/cart.model";

export async function GET() {
  try {
    await connectToDatabase();

    // Get all transactions with cart information
    const transactions = await Transaction.aggregate([
      {
        $lookup: {
          from: "carts",
          localField: "userId",
          foreignField: "user",
          as: "cartInfo",
        },
      },
      {
        $unwind: {
          path: "$cartInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          authority: 1,
          refId: 1,
          amount: 1,
          status: 1,
          gateway: 1,
          customer: 1,
          verifiedAt: 1,
          createdAt: 1,
          cart: {
            items: "$cartInfo.items",
            itemsPrice: "$cartInfo.itemsPrice",
            shippingPrice: "$cartInfo.shippingPrice",
            taxPrice: "$cartInfo.taxPrice",
            totalPrice: "$cartInfo.totalPrice",
            shippingAddress: "$cartInfo.shippingAddress",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
    ]);

    return NextResponse.json({
      success: true,
      transactionsCount: transactions.length,
      transactions: transactions.map((tx) => ({
        id: tx._id,
        authority: tx.authority,
        refId: tx.refId,
        amount: tx.amount,
        status: tx.status,
        customer: tx.customer,
        createdAt: tx.createdAt,
        cartItems: tx.cart?.items?.length || 0,
        cartTotal: tx.cart?.totalPrice || 0,
        shippingAddress: tx.cart?.shippingAddress,
      })),
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, customer } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: "userId and amount are required",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Create a test transaction
    const testTransaction = await Transaction.create({
      userId,
      authority: `test-auth-${Date.now()}`,
      amount: amount * 10, // Convert to Rial
      status: "completed",
      gateway: "zarinpal",
      customer: customer || {
        firstName: "کاربر",
        lastName: "تست",
        phone: "۰۹۱۲۳۴۵۶۷۸۹",
        email: "test@example.com",
        address: "آدرس تست",
      },
      verifiedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Test transaction created successfully",
      transaction: {
        id: testTransaction._id,
        authority: testTransaction.authority,
        amount: testTransaction.amount,
        status: testTransaction.status,
        customer: testTransaction.customer,
      },
    });
  } catch (error) {
    console.error("Error creating test transaction:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test transaction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
