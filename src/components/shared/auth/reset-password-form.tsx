"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    confirmPassword: z
      .string()
      .min(8, "تایید رمز عبور باید حداقل ۸ کاراکتر باشد"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const validateToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "خطا",
          description: result.error || "توکن بازنشانی نامعتبر یا منقضی شده است",
          variant: "destructive",
        });
        router.push("/forgot-password");
        return;
      }

      setIsValidToken(true);
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در بررسی توکن",
        variant: "destructive",
      });
      router.push("/forgot-password");
    }
  }, [token, router]);

  useEffect(() => {
    if (!token) {
      toast({
        title: "خطا",
        description: "توکن بازنشانی نامعتبر است",
        variant: "destructive",
      });
      router.push("/forgot-password");
      return;
    }

    // Validate token
    validateToken();
  }, [token, router, validateToken]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsPasswordReset(true);
        toast({
          title: "موفقیت",
          description: "رمز عبور شما با موفقیت تغییر یافت",
          variant: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "خطا",
          description: result.error || "خطا در بازنشانی رمز عبور",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ارتباط با سرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">در حال بررسی توکن...</p>
      </div>
    );
  }

  if (isPasswordReset) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="text-lg font-semibold">رمز عبور تغییر یافت!</h3>
        <p className="text-sm text-gray-600">
          رمز عبور شما با موفقیت تغییر یافت. حالا می‌توانید با رمز عبور جدید
          وارد شوید.
        </p>
        <div className="pt-4">
          <Link
            href="/sign-in"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right w-full">رمز عبور جدید</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور جدید را وارد کنید"
                    className="text-right pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right w-full">
                تایید رمز عبور جدید
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="تایید رمز عبور جدید"
                    className="text-right pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "در حال تغییر..." : "تغییر رمز عبور"}
        </Button>

        <div className="text-center">
          <Link
            href="/sign-in"
            className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            بازگشت به صفحه ورود
          </Link>
        </div>
      </form>
    </Form>
  );
}
