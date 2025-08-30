"use client";
import { useState } from "react";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("فرمت ایمیل نامعتبر است"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEmailSent(true);
        toast({
          title: "موفقیت",
          description:
            "ایمیل بازنشانی رمز عبور ارسال شد. لطفاً صندوق ورودی خود را بررسی کنید.",
          variant: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "خطا",
          description:
            result.error || "خطا در ارسال ایمیل. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="text-lg font-semibold">ایمیل ارسال شد!</h3>
        <p className="text-sm text-gray-600">
          لینک  رمز عبور به ایمیل شما ارسال شده است. لطفاً صندوق ورودی
          خود را بررسی کنید.
        </p>
        <div className="pt-4">
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            بازگشت به صفحه ورود
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right w-full">ایمیل</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="text-right"
                  disabled={isLoading}
                />
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
          {isLoading ? "در حال ارسال..." : "ارسال لینک "}
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
