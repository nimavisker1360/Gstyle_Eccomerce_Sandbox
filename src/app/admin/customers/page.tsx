import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminCustomersPage() {
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
            مدیریت مشتریان
          </h1>
          <p className="text-gray-600">
            مشاهده اطلاعات مشتریان و تاریخچه سفارشات آن‌ها
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">به زودی</h3>
          <p className="text-gray-500">
            صفحه مدیریت مشتریان در حال توسعه است و به زودی در دسترس خواهد بود.
          </p>
        </div>
      </div>
    </div>
  );
}

