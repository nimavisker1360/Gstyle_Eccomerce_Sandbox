import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId?: string;
  orderId?: string;
  authority: string;
  refId?: string;
  amount: number; // amount in Rial
  status: "pending" | "completed" | "failed" | "cancelled";
  gateway: "zarinpal";
  description?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  // اضافه کردن اطلاعات محصولات
  products?: Array<{
    productId: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    note?: string;
    // اضافه کردن فیلد link
    link?: string;
  }>;
  metadata?: Record<string, any>;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String },
    color: { type: String },
    note: { type: String },
    // اضافه کردن فیلد link برای لینک محصول خارجی
    link: { type: String },
  },
  { _id: false }
);

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String },
    orderId: { type: String },
    authority: { type: String, required: true, index: true, unique: true },
    refId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    gateway: { type: String, enum: ["zarinpal"], default: "zarinpal" },
    description: { type: String },
    customer: {
      firstName: String,
      lastName: String,
      phone: String,
      email: String,
      address: String,
    },
    // اضافه کردن فیلد محصولات
    products: [ProductSchema],
    metadata: { type: Schema.Types.Mixed },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
