import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مدیریت محصولات
          </h1>
          <p className="text-gray-600">
            اضافه کردن، ویرایش و مدیریت محصولات فروشگاه
          </p>
        </div>

        {/* Coming Soon */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">به زودی</h3>
          <p className="text-gray-500">
            صفحه مدیریت محصولات در حال توسعه است و به زودی در دسترس خواهد بود.
          </p>
        </div>
      </div>
    </div>
  );
}

