import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, customer, products } = body;

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

    // Create a test transaction with product information
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
      // اطلاعات کامل محصولات با slug های صحیح
      products: products || [
        {
          productId: "product-001",
          name: "لپ‌تاپ گیمینگ ASUS ROG Strix",
          slug: "asus-rog-strix-gaming-laptop", // مطابق با محصول ایجاد شده
          image:
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
          price: 2500000, // 25,000 تومان
          quantity: 1,
          size: "15.6 inch",
          color: "مشکی",
          note: "لطفاً لپ‌تاپ را با دقت بسته‌بندی کنید. باتری باید کاملاً شارژ باشد.",
        },
        {
          productId: "product-002",
          name: "کیف چرمی برند",
          slug: "leather-brand-bag", // مطابق با محصول ایجاد شده
          image:
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
          price: 150000, // 1,500 تومان
          quantity: 2,
          size: "L",
          color: "قهوه‌ای",
          note: "کیف باید در جعبه اصلی بسته‌بندی شود.",
        },
        {
          productId: "product-003",
          name: "گوشی هوشمند Samsung Galaxy S23",
          slug: "samsung-galaxy-s23", // مطابق با محصول ایجاد شده
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
          price: 3500000, // 35,000 تومان
          quantity: 1,
          size: "6.1 inch",
          color: "مشکی",
          note: "لطفاً گوشی را در جعبه اصلی و با محافظ صفحه بسته‌بندی کنید.",
        },
      ],
      verifiedAt: new Date(),
    });

    console.log(
      "✅ Test transaction with products created successfully:",
      testTransaction._id
    );

    return NextResponse.json({
      success: true,
      message: "Test transaction with products created successfully",
      transaction: {
        id: testTransaction._id,
        authority: testTransaction.authority,
        amount: testTransaction.amount,
        status: testTransaction.status,
        customer: testTransaction.customer,
        productsCount: testTransaction.products?.length || 0,
        products: testTransaction.products,
      },
    });
  } catch (error) {
    console.error("❌ Error creating test transaction with products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test transaction with products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Get all transactions with products
    const transactions = await Transaction.find({
      products: { $exists: true, $ne: [] },
    })
      .select("_id authority amount status customer products createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      transactionsCount: transactions.length,
      transactions: transactions.map((tx) => ({
        id: tx._id,
        authority: tx.authority,
        amount: tx.amount,
        status: tx.status,
        customer: tx.customer,
        productsCount: tx.products?.length || 0,
        createdAt: tx.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching transactions with products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch transactions with products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
