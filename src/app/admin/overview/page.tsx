import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminOrdersTable from "@/components/admin/admin-orders-table";
import AdminStats from "@/components/admin/admin-stats";
import AdminNavigation from "@/components/admin/admin-navigation";

export default async function AdminOverviewPage() {
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
            پنل مدیریت فروشگاه
          </h1>
          <p className="text-gray-600">
            مدیریت سفارشات و نظارت بر فعالیت‌های فروشگاه
          </p>
        </div>

        {/* Stats Cards */}
        <AdminStats />

        {/* Orders Table */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                سفارشات مشتریان
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                مشاهده و مدیریت تمام سفارشات ثبت شده
              </p>
            </div>
            <AdminOrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
