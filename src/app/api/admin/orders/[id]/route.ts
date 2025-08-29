import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db";
import { Transaction } from "@/lib/db/models/transaction.model";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and delete the transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تراکنش با موفقیت حذف شد",
      deletedTransaction: {
        id: deletedTransaction._id,
        customerName:
          `${deletedTransaction.customer?.firstName || ""} ${deletedTransaction.customer?.lastName || ""}`.trim() ||
          "نامشخص",
        amount: deletedTransaction.amount,
        status: deletedTransaction.status,
      },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
