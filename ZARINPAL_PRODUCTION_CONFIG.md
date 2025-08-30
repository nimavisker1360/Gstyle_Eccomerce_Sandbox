# تنظیمات زرین‌پال در حالت Production

## تغییرات انجام شده

تمام فایل‌های پرداخت زرین‌پال به‌روزرسانی شده‌اند تا از حالت Production استفاده کنند:

### فایل‌های تغییر یافته:

- `src/app/api/payment/zarinpal/request/route.ts` ✅
- `src/app/api/payment/zarinpal/verify-payment/route.ts` ✅
- `src/app/api/payment/zarinpal/verify/route.ts` ✅
- `src/app/api/payment/request/route.ts` ✅
- `src/app/api/payment/verify/route.ts` ✅
- `src/app/api/payment/zarinpal/create/route.ts` ✅

## تنظیمات محیطی مورد نیاز

برای استفاده از حالت Production، فایل `.env.local` یا `.env.production` را با این تنظیمات به‌روزرسانی کنید:

```bash
# ZarinPal Payment Gateway Configuration - PRODUCTION MODE
# کد درگاه واقعی خود را از پنل زرین‌پال دریافت کنید
ZARINPAL_MERCHANT_ID=your_actual_production_merchant_id

# Application Configuration
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=جی استایل

# Environment - Set to production for live payments
NODE_ENV=production

# ZarinPal Mode - Set to production for live payments
ZARINPAL_MODE=production

# Database Configuration
MONGODB_URI=your_production_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_secure_nextauth_secret
NEXTAUTH_URL=https://yourdomain.com

# Email Configuration (nodemailer with Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_account@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
EMAIL_FROM=your_gmail_account@gmail.com

# Admin Email for notifications
ADMIN_EMAIL=admin@yourdomain.com
```

## نکات مهم برای Production

### 1. کد درگاه واقعی

- از پنل زرین‌پال خود کد درگاه واقعی را دریافت کنید
- کد درگاه sandbox (تستی) دیگر کار نمی‌کند
- کد درگاه باید تایید شده و فعال باشد

### 2. دامنه و SSL

- سایت شما باید HTTPS داشته باشد
- دامنه سایت باید در پنل زرین‌پال ثبت شده باشد
- URL های callback باید معتبر باشند

### 3. تست قبل از راه‌اندازی

- حتماً با مبلغ کم تست کنید
- پرداخت‌های تستی را در محیط واقعی انجام دهید
- عملکرد callback URL ها را بررسی کنید

## تفاوت‌های Sandbox vs Production

| ویژگی       | Sandbox                                        | Production                                 |
| ----------- | ---------------------------------------------- | ------------------------------------------ |
| Base URL    | sandbox.zarinpal.com                           | www.zarinpal.com                           |
| Verify URL  | sandbox.zarinpal.com/pg/v4/payment/verify.json | api.zarinpal.com/pg/v4/payment/verify.json |
| کسر وجه     | ❌                                             | ✅                                         |
| کد درگاه    | تستی                                           | واقعی                                      |
| تایید درگاه | ❌                                             | ✅                                         |

## وضعیت فعلی

✅ **سیستم حالا کاملاً در حالت Production قرار دارد**

- درخواست‌های پرداخت به URL های واقعی زرین‌پال ارسال می‌شوند
- تمام کدهای تست حذف شده‌اند
- متغیر `isProduction` روی `true` تنظیم شده است

## مراحل نهایی راه‌اندازی

1. **کد درگاه واقعی**: کد درگاه production خود را در متغیر محیطی قرار دهید
2. **تست**: با مبلغ کم پرداخت تست کنید
3. **مانیتورینگ**: لاگ‌های پرداخت را بررسی کنید
4. **امنیت**: از HTTPS و تنظیمات امنیتی مطمئن شوید

## نکات امنیتی

- کد درگاه را هرگز در کد منبع قرار ندهید
- از متغیرهای محیطی برای اطلاعات حساس استفاده کنید
- لاگ‌های حساس را در production حذف کنید
- IP whitelist در پنل زرین‌پال تنظیم کنید

## پشتیبانی

در صورت بروز مشکل:

1. لاگ‌های سرور را بررسی کنید
2. وضعیت درگاه در پنل زرین‌پال را چک کنید
3. با پشتیبانی زرین‌پال تماس بگیرید

**🎉 درگاه پرداخت شما آماده دریافت پرداخت‌های واقعی است!**
