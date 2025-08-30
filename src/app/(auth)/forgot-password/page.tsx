import ForgotPasswordForm from "@/components/shared/auth/forgot-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full" dir="rtl">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center title-black">
            فراموشی رمز عبور
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            ایمیل خود را وارد کنید تا لینک رمز عبور برایتان ارسال شود
          </p>
        </CardHeader>

        <CardContent>
          <div className="text-right">
            <ForgotPasswordForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
