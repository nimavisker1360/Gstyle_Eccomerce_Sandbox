# راهنمای عیب‌یابی ایمیل تایید خرید

## مشکل فعلی

ایمیل تایید خرید از `golnazef1360@gmail.com` ارسال نمی‌شود.

## علل احتمالی

### 1. متغیرهای محیطی تنظیم نشده

سیستم از دو سرویس مختلف برای ارسال ایمیل استفاده می‌کند:

#### برای ایمیل فاکتور مشتری (Gmail SMTP):

```env
GMAIL_USER=golnazef1360@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
```

#### برای ایمیل ادمین (Resend):

```env
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=golnazef1360@gmail.com
```

### 2. تنظیمات ناقص

اگر `GMAIL_APP_PASSWORD` تنظیم نشده باشد، این خطا در لاگ ظاهر می‌شود:

```
"GMAIL_APP_PASSWORD is not configured; skipping invoice email."
```

## راه‌حل

### مرحله 1: ایجاد فایل .env.local

در ریشه پروژه، فایل `.env.local` ایجاد کنید:

```env
# Gmail Configuration for Customer Invoice Emails
GMAIL_USER=golnazef1360@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here

# Resend Configuration for Admin Emails
RESEND_API_KEY=your_resend_api_key_here

# Admin Email Settings
ADMIN_EMAIL=golnazef1360@gmail.com
ADMIN_NAME=مدیر سیستم

# Application Settings
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=جی استایل
```

### مرحله 2: دریافت Gmail App Password

1. به [Google Account Settings](https://myaccount.google.com/) بروید
2. "Security" → "2-Step Verification" را فعال کنید
3. "App passwords" → "Other (Custom name)" → نام دلخواه
4. رمز 16 کاراکتری تولید شده را کپی کنید
5. در `GMAIL_APP_PASSWORD` قرار دهید

### مرحله 3: دریافت Resend API Key

1. در [Resend](https://resend.com/) ثبت‌نام کنید
2. API Key بسازید
3. در `RESEND_API_KEY` قرار دهید

### مرحله 4: راه‌اندازی مجدد سرور

```bash
npm run dev
```

## تست سیستم

### تست ایمیل فاکتور مشتری:

1. یک پرداخت تست انجام دهید
2. در لاگ‌ها این پیام را ببینید:

```
"Email sent successfully to user@example.com"
```

### تست ایمیل ادمین:

1. پس از پرداخت موفق، ایمیل ادمین ارسال می‌شود
2. در لاگ‌ها این پیام را ببینید:

```
"Admin notification email sent successfully"
```

## عیب‌یابی

### اگر همچنان کار نمی‌کند:

1. **بررسی لاگ‌ها**: خطاهای مربوط به ایمیل را در console بررسی کنید
2. **بررسی متغیرها**: مطمئن شوید فایل `.env.local` درست خوانده می‌شود
3. **تست Gmail**: App Password را دوباره بسازید
4. **تست Resend**: API Key را بررسی کنید

### لاگ‌های مفید:

```bash
# برای بررسی متغیرهای محیطی
curl http://localhost:3000/api/status
```

## نکات مهم

- فایل `.env.local` را در Git commit نکنید
- App Password را هرگز در کد قرار ندهید
- برای production، از سرویس‌های حرفه‌ای مثل SendGrid استفاده کنید
- Gmail محدودیت 500 ایمیل در روز دارد

## وضعیت فعلی

سیستم حالا باید:

- ✅ ایمیل فاکتور به مشتری ارسال کند (Gmail SMTP)
- ✅ ایمیل اطلاع‌رسانی به ادمین ارسال کند (Resend)
- ✅ تمام خطاهای مربوط به ایمیل را در لاگ نمایش دهد
