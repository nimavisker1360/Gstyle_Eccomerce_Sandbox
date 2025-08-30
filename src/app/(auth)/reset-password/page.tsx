import ResetPasswordForm from "@/components/shared/auth/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Force dynamic rendering for this page since it uses useSearchParams
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <div className="w-full" dir="rtl">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl text-center title-black">
            بازنشانی رمز عبور
          </CardTitle>
          <p className="text-sm text-gray-600 text-center">
            رمز عبور جدید خود را وارد کنید
          </p>
        </CardHeader>

        <CardContent>
          <div className="text-right">
            <ResetPasswordForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
