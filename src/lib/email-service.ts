import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "golnazef1360@gmail.com",
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
    },
  });
};

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"GStyle" <${process.env.EMAIL_USER || "golnazef1360@gmail.com"}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

// Generate password reset email HTML
export const generatePasswordResetEmail = (
  resetUrl: string,
  userName: string
) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>بازنشانی رمز عبور</title>
      <style>
        body {
          font-family: 'Tahoma', 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #10b981;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .reset-button {
          display: inline-block;
          background-color: #10b981;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .reset-button:hover {
          background-color: #059669;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .url-info {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          font-family: monospace;
          font-size: 12px;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GStyle</div>
          <div class="title">بازنشانی رمز عبور</div>
        </div>
        
        <div class="content">
          <p>سلام ${userName} عزیز،</p>
          
          <p>درخواست بازنشانی رمز عبور برای حساب کاربری شما در GStyle دریافت شده است.</p>
          
          <p>برای بازنشانی رمز عبور خود، روی دکمه زیر کلیک کنید:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="reset-button">
              بازنشانی رمز عبور
            </a>
          </div>
          
          <div class="warning">
            <strong>⚠️ توجه:</strong>
            <ul style="margin: 10px 0; padding-right: 20px;">
              <li>این لینک تا 1 ساعت معتبر است</li>
              <li>اگر شما درخواست بازنشانی رمز عبور نداده‌اید، این ایمیل را نادیده بگیرید</li>
              <li>رمز عبور شما تغییر نخواهد یافت مگر اینکه روی لینک بالا کلیک کنید</li>
            </ul>
          </div>
          
          <p>اگر دکمه بالا کار نمی‌کند، می‌توانید لینک زیر را در مرورگر خود کپی کنید:</p>
          
          <div class="url-info">
            ${resetUrl}
          </div>
        </div>
        
        <div class="footer">
          <p>این ایمیل از طرف سیستم GStyle ارسال شده است</p>
          <p>اگر سوالی دارید، با پشتیبانی تماس بگیرید</p>
          <p>© 2024 GStyle. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
