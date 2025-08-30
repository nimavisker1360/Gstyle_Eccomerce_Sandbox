"use client";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCartStore from "@/hooks/use-cart-store";
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from "@/lib/constants";
import { formatPersianAmount } from "@/lib/utils/format-persian-numbers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { cart, updateItem, removeItem, updateItemNote } = useCartStore();
  const { items } = cart;
  const { toast } = useToast();
  // Calculate total directly from items (same as checkout)
  const computedItemsPrice =
    items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  // Debug logging
  console.log("Cart - Items:", items);
  console.log("Cart - Computed Items Price:", computedItemsPrice);
  console.log("Cart - Store Items Price:", cart.itemsPrice);

  const router = useRouter();

  // Validation function to check if all items have descriptions
  const validateCartDescriptions = () => {
    const itemsWithoutDescription = items.filter(
      (item) => !item.note || item.note.trim() === ""
    );

    if (itemsWithoutDescription.length > 0) {
      toast({
        title: "توضیحات محصولات الزامی است",
        description: "حتما قسمت توضیحات سایز و رنگ و بقیه موارد مشخص کنید",
        variant: "success",
      });
      return false;
    }
    return true;
  };

  // Handle checkout button click with validation
  const handleProceedToCheckout = () => {
    if (validateCartDescriptions()) {
      router.push("/checkout");
    }
  };
  return (
    <div className="min-h-screen pb-4">
      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        {items.length === 0 ? (
          <Card className="col-span-4 rounded-none bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-10">
              <div
                dir="rtl"
                className="flex items-center justify-between gap-6"
              >
                <div className="flex-1 text-right">
                  <h2 className="text-2xl md:text-3xl font-bold text-black">
                    سبد خرید شما خالی است
                  </h2>
                  <p className="mt-2 text-xs md:text-sm text-black">
                    هنوز محصولی اضافه نکرده‌اید. برای شروع خرید، به صفحه اصلی
                    بروید.
                  </p>
                  <div className="mt-6 flex justify-end">
                    <Link href="/" className="inline-flex">
                      <Button className="rounded-full bg-green-600 hover:bg-green-700 px-6">
                        ادامه خرید در {APP_NAME}
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/80 border border-blue-100 shadow-sm text-green-700">
                  <ShoppingCart className="w-12 h-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="w-full md:col-span-3">
              <Card className="rounded-none bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
                <CardHeader className="text-3xl pb-0 text-right">
                  سبد خرید
                  <CardDescription className="text-sm text-green-700 text-right">
                    اقلام انتخاب‌شده شما در زیر نمایش داده می‌شود
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 order-cards-alt">
                  <div className="flex justify-end border-b border-green-200 mb-4 text-green-700">
                    قیمت
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.clientId}
                      className="order-item-row flex flex-col md:flex-row justify-between py-4 gap-4"
                    >
                      {item.link ? (
                        <Link href={item.link} target="_blank">
                          <div className="relative w-40 h-40">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="20vw"
                              style={{
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </Link>
                      ) : (
                        <Link href={`/product/${item.slug}`}>
                          <div className="relative w-40 h-40">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="20vw"
                              style={{
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </Link>
                      )}

                      <div className="flex-1 space-y-4 text-right">
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            className="text-lg hover:no-underline text-blue-600 hover:text-blue-800"
                          >
                            {item.name} (مشاهده در فروشگاه)
                          </Link>
                        ) : (
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-lg hover:no-underline"
                          >
                            {item.name}
                          </Link>
                        )}
                        <div>
                          <p className="text-sm">
                            <span className="font-bold">رنگ: </span>{" "}
                            {item.color}
                          </p>
                          <p className="text-sm">
                            <span className="font-bold">سایز: </span>{" "}
                            {item.size}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center justify-end">
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) =>
                              updateItem(item, Number(value))
                            }
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue>تعداد: {item.quantity}</SelectValue>
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {Array.from({
                                length: item.countInStock,
                              }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            variant={"outline"}
                            onClick={() => removeItem(item)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            حذف
                          </Button>
                        </div>
                        {/* per-item note to ask questions */}
                        <div className="mt-2">
                          <label className="block text-sm mb-1">
                            توضیحات/سوال شما برای این آیتم
                          </label>
                          <Textarea
                            dir="rtl"
                            className="bg-white"
                            placeholder="اینجا سوال یا توضیح خود را درباره این محصول بنویسید..."
                            value={item.note ?? ""}
                            onChange={(e) =>
                              updateItemNote(item.clientId, e.target.value)
                            }
                          />
                          {/* auto-saved */}
                        </div>
                      </div>
                      <div>
                        <p className="text-right text-blue-700">
                          <span className="font-bold text-lg text-green-700">
                            {formatPersianAmount(item.price * item.quantity)}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end text-lg my-2 text-right">
                    جمع کل (
                    {items.reduce((acc, item) => acc + item.quantity, 0)} آیتم):{" "}
                    <span className="font-bold ml-1 text-green-700">
                      {formatPersianAmount(computedItemsPrice)}
                    </span>{" "}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="w-full md:col-span-1 mt-4 md:mt-0">
              <Card className="rounded-none bg-gradient-to-l from-blue-50 to-green-50 border-blue-200">
                <CardContent className="p-4 md:py-4 space-y-4 text-right">
                  {computedItemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className="flex-1">
                      اضافه کنید{" "}
                      <span className="text-green-700">
                        {formatPersianAmount(
                          FREE_SHIPPING_MIN_PRICE - computedItemsPrice
                        )}
                      </span>{" "}
                      از محصولات واجد شرایط به سفارش خود برای ارسال رایگان
                    </div>
                  ) : null}
                  <div className="text-base md:text-lg font-medium">
                    جمع کل (
                    {items.reduce((acc, item) => acc + item.quantity, 0)} آیتم):{" "}
                    <span className="font-bold text-green-700">
                      {formatPersianAmount(computedItemsPrice)}
                    </span>{" "}
                  </div>
                  <Button
                    onClick={handleProceedToCheckout}
                    className="rounded-none w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 text-base md:text-sm"
                  >
                    ادامه به تسویه حساب
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
      <BrowsingHistoryList className="mt-10" />
    </div>
  );
}
