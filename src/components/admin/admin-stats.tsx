"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";

interface StatsData {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatsData>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("خطا در دریافت آمار:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Listen for order updates across the admin panel
  useEffect(() => {
    const handleOrderUpdate = () => {
      fetchStats();
    };

    // Listen for custom events from other components
    window.addEventListener("adminOrdersUpdated", handleOrderUpdate);

    return () => {
      window.removeEventListener("adminOrdersUpdated", handleOrderUpdate);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "کل سفارشات",
      value: formatNumber(stats.totalOrders),
      icon: ShoppingBag,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "درآمد کل",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "مشتریان",
      value: formatNumber(stats.totalCustomers),
      icon: Users,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "سفارشات در انتظار",
      value: formatNumber(stats.pendingOrders),
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "سفارشات امروز",
      value: formatNumber(stats.todayOrders),
      icon: Package,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "درآمد ماهانه",
      value: formatCurrency(stats.monthlyRevenue),
      icon: TrendingUp,
      color: "bg-pink-500",
      textColor: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow duration-200 min-h-[120px] md:min-h-[140px]"
          >
            <div className="flex flex-col h-full">
              {/* آیکون بالا */}
              <div className="flex justify-center mb-2 md:mb-3">
                <div className={`${stat.bgColor} p-3 md:p-3 rounded-full`}>
                  <IconComponent
                    className={`w-6 h-6 md:w-6 md:h-6 ${stat.textColor}`}
                  />
                </div>
              </div>

              {/* متن‌ها پایین */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2 leading-tight px-1">
                  {stat.title}
                </p>
                <p className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
