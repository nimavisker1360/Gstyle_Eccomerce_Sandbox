# 🚀 راهنمای کامل تنظیم ایمیل برای فراموشی رمز عبور

## 📧 مرحله 1: تنظیم Gmail App Password

### 1.1 فعال‌سازی 2-Step Verification

1. به [Google Account Settings](https://myaccount.google.com/) بروید
2. روی "Security" کلیک کنید
3. "2-Step Verification" را فعال کنید

### 1.2 ایجاد App Password

1. در همان صفحه Security، "App passwords" را پیدا کنید
2. روی "App passwords" کلیک کنید
3. "Select app" → "Other (Custom name)" را انتخاب کنید
4. نام دلخواه مثل "GStyle App" وارد کنید
5. "Generate" را کلیک کنید
6. رمز 16 کاراکتری تولید شده را کپی کنید

## 🔧 مرحله 2: تنظیم متغیرهای محیطی

### 2.1 ایجاد فایل .env.local

در پوشه اصلی پروژه، فایل `.env.local` ایجاد کنید:

```env
# Email Configuration for Gmail
EMAIL_PROVIDER=gmail
GMAIL_USER=golnazef1360@gmail.com
GMAIL_APP_PASSWORD=cbhk ozkv eeqz zrxu

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Support Email
SUPPORT_EMAIL=nimabaghery@gmail.com
SENDER_EMAIL=golnazef1360@gmail.com
SENDER_NAME="جی استایل"
```

### 2.2 جایگزینی رمز

`YOUR_16_CHARACTER_APP_PASSWORD_HERE` را با رمز 16 کاراکتری که از Gmail گرفتید جایگزین کنید.

## 🧪 مرحله 3: تست سیستم

### 3.1 راه‌اندازی مجدد سرور

```bash
npm run dev
```

### 3.2 تست فراموشی رمز عبور

1. به صفحه `/sign-in` بروید
2. روی "رمز عبور خود را فراموش کرده‌اید؟" کلیک کنید
3. ایمیل خود را وارد کنید
4. دکمه "ارسال لینک بازنشانی" را کلیک کنید

### 3.3 بررسی ایمیل

- ایمیل باید در صندوق ورودی `golnazef1360@gmail.com` دریافت شود
- اگر در Spam بود، آن را به Inbox منتقل کنید

## 🔍 مرحله 4: عیب‌یابی

### 4.1 خطاهای رایج

#### خطای "Authentication failed"

- App Password را درست وارد کرده‌اید؟
- 2-Step Verification فعال است؟

#### خطای "Invalid credentials"

- ایمیل `golnazef1360@gmail.com` درست است؟
- رمز App Password 16 کاراکتر است؟

#### ایمیل دریافت نمی‌شود

- Spam folder را بررسی کنید
- Console مرورگر را برای خطاها چک کنید
- Network tab را برای درخواست‌های API بررسی کنید

### 4.2 بررسی Console

در Developer Tools مرورگر، Console را بررسی کنید:

```
Email sent successfully to user@example.com
```

### 4.3 بررسی Network

در Network tab، درخواست به `/api/auth/forgot-password` را بررسی کنید:

- Status: 200
- Response: `{"success": true, "message": "لینک بازنشانی رمز عبور ارسال شد"}`

## 📱 مرحله 5: استفاده از سیستم

### 5.1 جریان کامل

1. **درخواست بازنشانی**: کاربر ایمیل وارد می‌کند
2. **تولید توکن**: سیستم توکن امن تولید می‌کند
3. **ارسال ایمیل**: ایمیل زیبا با لینک ارسال می‌شود
4. **بازنشانی**: کاربر روی لینک کلیک و رمز جدید وارد می‌کند
5. **ورود**: کاربر با رمز جدید وارد می‌شود

### 5.2 ویژگی‌های ایمیل

- 🎨 **طراحی زیبا**: RTL، رنگ‌بندی حرفه‌ای
- 🔒 **امنیت بالا**: توکن موقت، هش کردن رمز
- ⏰ **اعتبار زمانی**: 1 ساعت
- 📱 **Responsive**: سازگار با موبایل

## 🚨 نکات مهم امنیتی

### 6.1 محافظت از App Password

- هرگز App Password را در کد قرار ندهید
- فقط در فایل `.env.local` استفاده کنید
- فایل `.env.local` را در Git commit نکنید

### 6.2 محدودیت‌های Gmail

- حداکثر 500 ایمیل در روز
- برای استفاده بیشتر، SendGrid یا Resend استفاده کنید

## 🔄 مرحله 6: بهینه‌سازی

### 6.1 تنظیمات پیشرفته

```env
# برای production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# برای تست
NODE_ENV=development
```

### 6.2 سرویس‌های جایگزین

اگر Gmail کار نکرد:

- **SendGrid**: حرفه‌ای و قابل اعتماد
- **Resend**: ساده و سریع
- **SMTP Custom**: انعطاف‌پذیر

## 📞 پشتیبانی

اگر مشکلی داشتید:

1. Console errors را بررسی کنید
2. Network requests را چک کنید
3. فایل `.env.local` را بررسی کنید
4. Gmail App Password را دوباره بسازید

---

**🎯 هدف**: سیستم ایمیل کاملاً کارآمد برای فراموشی رمز عبور
**🔧 تکنولوژی**: Nodemailer + Gmail SMTP
**🌐 پشتیبانی**: RTL، فارسی، Responsive
**🔒 امنیت**: توکن موقت، هش کردن، validation
