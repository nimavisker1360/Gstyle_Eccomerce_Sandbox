"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  BarChart3,
} from "lucide-react";

const navigation = [
  {
    name: "نمای کلی",
    href: "/admin/overview",
    icon: LayoutDashboard,
  },
  {
    name: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "مشتریان",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "محصولات",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "گزارشات",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 space-x-reverse">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <IconComponent className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

