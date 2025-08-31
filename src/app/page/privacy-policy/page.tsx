import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "قوانین و حریم خصوصی",
};

export default function PrivacyPolicyPage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl"
      />

      <main className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10 font-iransans">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">
              قوانین و مقررات
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* removed top checkbox per request */}

            <ol className="list-decimal list-inside space-y-3 leading-8 text-gray-200">
              <li>
                مشتری عزیز حتما از موجودی محصول در لینک های گذاشته شده اطمینان
                حاصل کنید .در صورت آگاه نبودن لینک محصول برای تیم پشتیبانی
                بفرستید تا توضیحات کافی براتون فرستاده بشود در دسته مد و پوشاک
                از موجودی رنگ و سایز آن در وبسایت های مبدا اطمینان حاصل کنید
                بعدا محصول را به سبد خرید اضافه کنید
              </li>
              <li>
                ارسال محصولات معمولا از یک هفته و حداکثر ۲۰ روز کاری می‌باشد.
              </li>
              <li>
                لطفا توجه داشته باشید که بعد از گذاشتن محصول در سبد خرید در قسمت
                توضیحات رنگ و سایز یا هر موردی که مد نظرتون هست بنویسید تا تیم
                پشتیبانی از روی این توضیحات محصول تهیه کنند در صورت عدم
                توضیحات تمام عواقب بعدش به عهده مشتری میباشد
              </li>
              <li>
                هزینه کلی شامل محاسبه قیمت لیرِ محصول، کارمزد gstyle و هزینه
                ارسال تا درب منزل می‌باشد و هزینه اضافی بعدا از شما گرفته
                نمی‌شود.
              </li>
              <li>
                برای اینکه بتوانید از همه قابلیت‌های بات به‌خوبی استفاده کنید،
                حتما از VPN استفاده کنید چون وب‌سایت‌های برندها معمولا فیلتر
                هستند.
              </li>
              <li>
              پرداخت‌ نهایی از طریق  درگاه زرین پال صورت میگیره بلافاصله  فاکتور تایید برای مشتری ایمیل میشود
              </li>
              <li>
                برای رفاه مشتری‌های عزیز، پشتیبانی از ساعت ۱۰ صبح تا ۱۱ شب
                پاسخگو می‌باشد.
              </li>
              <li>
                اجناس بعد از ارسال در صورت مشکل‌دار بودن قابل تعویض می‌باشند.
                مشتری می‌بایست حداکثر تا ۱ روز برای ما ارسال کند، در غیر این
                صورت تعویض انجام نمی‌شود.
              </li>
            </ol>
            {/* 
            <p className="mt-6 text-xs text-center text-gray-400">
              آخرین به‌روزرسانی: امروز
            </p> */}
            <div className="mt-6 flex justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-md bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-sky-700 active:scale-[0.99] transition"
              >
                برگشت
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
