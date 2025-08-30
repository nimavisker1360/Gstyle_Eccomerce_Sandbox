# تنظیمات زرین‌پال در حالت Sandbox

## تغییرات انجام شده

تمام فایل‌های پرداخت زرین‌پال به‌روزرسانی شده‌اند تا از حالت Sandbox استفاده کنند:

### فایل‌های تغییر یافته:

- `src/app/api/payment/zarinpal/request/route.ts`
- `src/app/api/payment/request/route.ts`
- `src/app/api/payment/zarinpal/verify-payment/route.ts`
- `src/app/api/payment/zarinpal/create/route.ts`
- `src/app/api/payment/verify/route.ts`
- `src/app/api/payment/zarinpal/verify/route.ts`

## تنظیمات محیطی

برای استفاده از حالت Sandbox، فایل `.env.local` را در ریشه پروژه ایجاد کنید:

```bash
# ZarinPal Payment Gateway Configuration - SANDBOX MODE
ZARINPAL_MERCHANT_ID=your_sandbox_merchant_id_here

# Application Configuration
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=جی استایل

# Environment - Set to development for sandbox testing
NODE_ENV=development

# Force sandbox mode for ZarinPal
ZARINPAL_MODE=sandbox

# سایر تنظیمات مورد نیاز...
```

## نکات مهم

1. **حالت Sandbox**: تمام درخواست‌های پرداخت به `https://sandbox.zarinpal.com` ارسال می‌شوند
2. **کد درگاه**: از کد درگاه Sandbox استفاده کنید (نه کد درگاه اصلی)
3. **تست**: می‌توانید پرداخت‌های تستی انجام دهید بدون نگرانی از کسر وجه واقعی
4. **تغییر به Production**: برای استفاده در محیط تولید، کد را به حالت اصلی برگردانید

## تست درگاه

1. سرور را اجرا کنید: `npm run dev`
2. به صفحه پرداخت بروید
3. مبلغ تستی وارد کنید
4. درگاه Sandbox زرین‌پال باز می‌شود
5. پرداخت تستی انجام دهید

## بازگشت به حالت Production

برای بازگشت به حالت تولید، فایل‌های زیر را ویرایش کنید:

```typescript
// در تمام فایل‌های پرداخت، این خط را:
const isProduction = false;
const baseUrl = "https://sandbox.zarinpal.com/pg/rest/WebGate";

// به این تغییر دهید:
const isProduction =
  process.env.ZARINPAL_MODE === "production" ||
  process.env.NODE_ENV === "production";
const baseUrl = isProduction
  ? "https://www.zarinpal.com/pg/rest/WebGate"
  : "https://sandbox.zarinpal.com/pg/rest/WebGate";
```

## مزایای حالت Sandbox

- ✅ تست بدون ریسک مالی
- ✅ بررسی عملکرد درگاه
- ✅ تست سناریوهای مختلف
- ✅ توسعه و دیباگ آسان‌تر
- ✅ عدم نیاز به کد درگاه اصلی

## وضعیت فعلی

سیستم حالا کاملاً در حالت Sandbox کار می‌کند و تمام درخواست‌ها به آدرس‌های تستی زرین‌پال ارسال می‌شوند.
