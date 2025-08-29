"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  BarChart3,
  Menu,
  X,
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8 space-x-reverse">
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

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-lg font-semibold text-gray-900">پنل مدیریت</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="pb-4 border-t border-gray-200">
              <div className="space-y-1 pt-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-r-4 border-blue-500"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <IconComponent className="h-6 w-6 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
