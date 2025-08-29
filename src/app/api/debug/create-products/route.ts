import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Product from "@/lib/db/models/product.model";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Create test products that match the ones in transactions
    const testProducts = [
      {
        name: "لپ‌تاپ گیمینگ ASUS ROG Strix",
        slug: "asus-rog-strix-gaming-laptop",
        description:
          "لپ‌تاپ گیمینگ قدرتمند با پردازنده Intel Core i7 و کارت گرافیک RTX 3060",
        price: 2500000, // 25,000 تومان
        listPrice: 2800000, // قیمت اصلی
        category: "لپ‌تاپ",
        brand: "ASUS",
        countInStock: 10,
        images: [
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
        ],
        isPublished: true,
        avgRating: 4.5,
        numReviews: 12,
        numSales: 8,
        colors: ["مشکی", "سفید"],
        sizes: ["15.6 inch"],
        features: [
          "پردازنده Intel Core i7",
          "کارت گرافیک RTX 3060",
          "16GB RAM",
          "512GB SSD",
        ],
        specifications: {
          processor: "Intel Core i7-12700H",
          graphics: "NVIDIA RTX 3060 6GB",
          memory: "16GB DDR4",
          storage: "512GB NVMe SSD",
          display: "15.6 inch FHD 144Hz",
        },
      },
      {
        name: "کیف چرمی برند",
        slug: "leather-brand-bag",
        description:
          "کیف چرمی با کیفیت بالا و طراحی مدرن، مناسب برای استفاده روزانه",
        price: 150000, // 1,500 تومان
        listPrice: 180000, // قیمت اصلی
        category: "کیف",
        brand: "برند",
        countInStock: 25,
        images: [
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
        ],
        isPublished: true,
        avgRating: 4.2,
        numReviews: 8,
        numSales: 15,
        colors: ["قهوه‌ای", "مشکی"],
        sizes: ["S", "M", "L"],
        features: ["چرم طبیعی", "طراحی مدرن", "کیفیت بالا", "قابلیت شستشو"],
        specifications: {
          material: "چرم طبیعی",
          size: "L",
          color: "قهوه‌ای",
          weight: "800 گرم",
          dimensions: "30 x 20 x 10 سانتی‌متر",
        },
      },
      {
        name: "گوشی هوشمند Samsung Galaxy S23",
        slug: "samsung-galaxy-s23",
        description:
          "گوشی هوشمند پیشرفته با دوربین 108 مگاپیکسلی و پردازنده Snapdragon 8 Gen 2",
        price: 3500000, // 35,000 تومان
        listPrice: 3800000, // قیمت اصلی
        category: "گوشی",
        brand: "Samsung",
        countInStock: 15,
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        ],
        isPublished: true,
        avgRating: 4.7,
        numReviews: 25,
        numSales: 20,
        colors: ["مشکی", "سفید", "بنفش"],
        sizes: ["6.1 inch"],
        features: [
          "دوربین 108MP",
          "پردازنده Snapdragon 8 Gen 2",
          "8GB RAM",
          "256GB Storage",
        ],
        specifications: {
          processor: "Snapdragon 8 Gen 2",
          memory: "8GB LPDDR5X",
          storage: "256GB UFS 4.0",
          camera: "108MP + 12MP + 10MP",
          battery: "5000mAh",
          display: "6.1 inch Dynamic AMOLED 2X",
        },
      },
    ];

    // Create products
    const createdProducts = [];
    for (const productData of testProducts) {
      const existingProduct = await Product.findOne({ slug: productData.slug });
      if (!existingProduct) {
        const product = await Product.create(productData);
        createdProducts.push(product);
        console.log(`✅ Product created: ${product.name}`);
      } else {
        console.log(`ℹ️ Product already exists: ${productData.name}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Test products created successfully",
      createdCount: createdProducts.length,
      products: createdProducts.map((p) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
      })),
    });
  } catch (error) {
    console.error("❌ Error creating test products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    // Get all published products
    const products = await Product.find({ isPublished: true })
      .select("_id name slug price category brand countInStock")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      productsCount: products.length,
      products: products.map((p) => ({
        id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        category: p.category,
        brand: p.brand,
        countInStock: p.countInStock,
      })),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
