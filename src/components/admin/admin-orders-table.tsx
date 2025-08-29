"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Package,
  User,
  MapPin,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  note?: string;
  category: string;
  // اضافه کردن فیلد link
  link?: string;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  province: string;
  phone: string;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  expectedDeliveryDate: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (error) {
      console.error("خطا در دریافت سفارشات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR", {
      style: "currency",
      currency: "IRR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isPaid: boolean, isDelivered: boolean) => {
    if (!isPaid) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          در انتظار پرداخت
        </span>
      );
    }
    if (!isDelivered) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          پرداخت شده
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        تحویل شده
      </span>
    );
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این سفارش را حذف کنید؟")) {
      return;
    }

    setDeletingOrder(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted order from the list
        setOrders(orders.filter((order) => order._id !== orderId));
        // Refresh the data
        fetchOrders();
        // Notify other components about the order update
        window.dispatchEvent(new CustomEvent("adminOrdersUpdated"));
      } else {
        const error = await response.json();
        alert(`خطا در حذف سفارش: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("خطا در حذف سفارش");
    } finally {
      setDeletingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          سفارشی یافت نشد
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          هنوز هیچ سفارشی ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="divide-y divide-gray-200">
        {orders.map((order) => (
          <div key={order._id} className="bg-white">
            {/* Order Header */}
            <div
              className="px-4 md:px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors md:cursor-default md:hover:bg-white"
              onClick={() =>
                window.innerWidth <= 768 && toggleOrderExpansion(order._id)
              }
            >
              <div className="flex items-center space-x-3 space-x-reverse md:space-x-4">
                <div className="hidden md:flex flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-2 md:space-x-reverse">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      سفارش #{order._id.slice(-8)}
                    </span>
                    <div className="mt-1 md:mt-0">
                      {getStatusBadge(order.isPaid, order.isDelivered)}
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1 md:hidden">
                    {expandedOrder === order._id ? "کمتر ▲" : "جزئیات بیشتر ▼"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse md:space-x-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-sm md:text-lg font-semibold text-green-600 block">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => toggleOrderExpansion(order._id)}
                  className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                  title="مشاهده جزئیات سفارش"
                >
                  {expandedOrder === order._id ? (
                    <ChevronUp className="w-4 h-4 md:w-5 md:h-5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  disabled={deletingOrder === order._id}
                  className="p-1.5 md:p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="حذف سفارش"
                >
                  {deletingOrder === order._id ? (
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder === order._id && (
              <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200">
                {/* Customer Information */}
                <div className="mb-6">
                  <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <User className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                    اطلاعات مشتری
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <span className="text-sm text-gray-600 flex-shrink-0">
                        نام:
                      </span>
                      <span className="text-sm font-medium break-words">
                        {order.shippingAddress?.fullName}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 space-x-reverse">
                      <Phone className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium break-all">
                        {order.shippingAddress?.phone}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 space-x-reverse sm:col-span-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium break-words">
                        {order.shippingAddress?.street},{" "}
                        {order.shippingAddress?.city}
                      </span>
                    </div>
                    <div className="flex items-start space-x-2 space-x-reverse sm:col-span-2">
                      <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">
                        تحویل: {formatDate(order.expectedDeliveryDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Package className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-600" />
                    محصولات سفارش شده
                  </h4>
                  <div className="space-y-3 md:space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 md:p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                          <div className="flex-shrink-0 w-full sm:w-auto">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg mx-auto sm:mx-0"
                            />
                          </div>
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1">
                                <h5 className="text-sm md:text-lg font-medium text-gray-900 mb-2 break-words">
                                  {item.name}
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                                  <div>قیمت: {formatCurrency(item.price)}</div>
                                  <div>تعداد: {item.quantity}</div>
                                  {item.size && <div>سایز: {item.size}</div>}
                                  {item.color && <div>رنگ: {item.color}</div>}
                                </div>
                                {item.note && (
                                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center mb-2">
                                      <MessageSquare className="h-4 w-4 mr-2 text-yellow-600" />
                                      <span className="text-xs md:text-sm font-medium text-yellow-800">
                                        توضیحات/سوال مشتری:
                                      </span>
                                    </div>
                                    <p className="text-yellow-700 text-xs md:text-sm break-words">
                                      {item.note}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-center sm:items-end space-y-2 mt-3 lg:mt-0 w-full lg:w-auto">
                                {/* اگر محصول از Google Shopping است، فقط لینک فروشگاه نمایش دهید */}
                                {item.link ? (
                                  <Link
                                    href={item.link}
                                    target="_blank"
                                    className="inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 border border-transparent text-xs md:text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
                                  >
                                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                    <span className="hidden sm:inline">
                                      مشاهده محصول در فروشگاه
                                    </span>
                                    <span className="sm:hidden">فروشگاه</span>
                                  </Link>
                                ) : (
                                  /* اگر محصول داخلی است، لینک به صفحه محصول نمایش دهید */
                                  <Link
                                    href={`/product/${item.slug}`}
                                    target="_blank"
                                    className="inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 border border-transparent text-xs md:text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                                  >
                                    <ExternalLink className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                    <span className="hidden sm:inline">
                                      مشاهده محصول
                                    </span>
                                    <span className="sm:hidden">محصول</span>
                                  </Link>
                                )}
                                <span className="text-sm md:text-lg font-semibold text-green-600">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div className="text-base md:text-lg font-medium text-gray-900">
                      جمع کل سفارش:
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-green-600">
                      {formatCurrency(order.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
