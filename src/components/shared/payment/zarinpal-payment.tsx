"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatToman } from "@/lib/utils";
import { formatPersianAmount } from "@/lib/utils/format-persian-numbers";

interface ZarinpalPaymentProps {
  totalAmount: number;
  orderId: string;
  onPaymentStart?: () => void;
  onPaymentComplete?: () => void;
}

export default function ZarinpalPayment({
  totalAmount,
  orderId,
  onPaymentStart,
  onPaymentComplete,
}: ZarinpalPaymentProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  // Debug logging
  console.log("ZarinpalPayment Component - Total Amount:", totalAmount);

  // Use Toman directly for Zarinpal API
  const amountInToman = totalAmount;

  const handlePayment = async () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام کامل و شماره تلفن را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumber.length < 10) {
      toast({
        title: "خطا",
        description: "شماره تلفن باید حداقل ۱۰ رقم باشد",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      onPaymentStart?.();

      console.log("Sending payment request with data:", {
        amount: amountInToman,
        description: `پرداخت سفارش ${orderId} - ${fullName}`,
        orderId: orderId,
        callbackUrl: `${window.location.origin}/api/payment/zarinpal/verify?orderId=${orderId}`,
        phoneNumber: phoneNumber,
        fullName: fullName,
      });

      const response = await fetch("/api/payment/zarinpal/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInToman, // Send amount in Toman to Zarinpal
          description: `پرداخت سفارش ${orderId} - ${fullName}`,
          orderId: orderId,
          callbackUrl: `${window.location.origin}/api/payment/zarinpal/verify?orderId=${orderId}`,
          phoneNumber: phoneNumber,
          fullName: fullName,
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        onPaymentComplete?.();
        toast({
          title: "در حال انتقال به درگاه پرداخت",
          description: "لطفاً منتظر بمانید...",
        });

        // Redirect to Zarinpal payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || "خطا در ایجاد درخواست پرداخت");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "خطا در پرداخت",
        description: "لطفاً مجدداً تلاش کنید",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return formatPersianAmount(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-gray-800">
          پرداخت امن از زرین‌پال
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          انتقال مستقیم به درگاه بانکی زرین‌پال
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">خلاصه سفارش</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">محصولات:</span>
              <span className="font-medium">{formatAmount(totalAmount)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium text-gray-800">جمع کل سفارش:</span>
              <span className="font-bold text-green-600 text-lg">
                {formatAmount(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* User Details Form */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-800">وارد کردن مشخصات</h3>

          <div className="space-y-2">
            <Label htmlFor="fullName">نام کامل</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="نام و نام خانوادگی خود را وارد کنید"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">شماره تلفن</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="شماره تلفن خود را وارد کنید"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !fullName.trim() || !phoneNumber.trim()}
          className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="ml-2 h-5 w-5 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            <>
              <CreditCard className="ml-2 h-5 w-5" />
              پرداخت از زرین‌پال
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          <p>تمامی تراکنش‌ها توسط زرین‌پال محافظت می‌شوند</p>
          <p className="mt-1">اطلاعات شما نزد ما محفوظ است</p>
        </div>
      </CardContent>
    </Card>
  );
}
