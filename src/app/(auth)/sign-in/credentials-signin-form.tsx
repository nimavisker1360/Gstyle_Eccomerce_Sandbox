"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUserSignIn } from "@/types";

import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignInSchema } from "@/lib/validator";
import { APP_NAME } from "@/lib/constants";
import SigninLoading from "@/components/shared/auth/signin-loading";

const signInDefaultValues = {
  email: "",
  password: "",
};

export default function CredentialsSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    setIsLoading(true);

    try {
      console.log("Attempting sign in with:", data.email);

      // First test credentials using our test API
      const testResponse = await fetch("/api/test-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
        }),
      });

      const testResult = await testResponse.json();
      console.log("Test API result:", testResult);

      if (!testResult.success) {
        setIsLoading(false);
        toast({
          title: "خطا",
          description: testResult.error || "احراز هویت ناموفق بود",
          variant: "destructive",
        });
        return;
      }

      if (!testResult.passwordValid) {
        setIsLoading(false);
        toast({
          title: "خطا",
          description: "رمز عبور نامعتبر است",
          variant: "destructive",
        });
        return;
      }

      // If credentials are valid, attempt NextAuth sign-in
      const result = await signIn("credentials", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        setIsLoading(false);
        console.log("Sign in failed:", result.error);
        toast({
          title: "خطا",
          description: "احراز هویت NextAuth ناموفق بود",
          variant: "destructive",
        });
      } else {
        console.log("Sign in successful, showing toast and redirecting...");

        // Show success toast and redirect to home
        toast({
          title: "موفقیت",
          description: "ورود با موفقیت انجام شد",
          variant: "success",
          duration: 3000,
        });

        // Wait for toast to show, then redirect
        setTimeout(() => {
          router.push(callbackUrl);
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Sign in error:", error);
      toast({
        title: "خطا",
        description: "احراز هویت ناموفق بود",
        variant: "destructive",
      });
    }
  };

  // Show loading component while processing
  if (isLoading) {
    return <SigninLoading />;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-right w-full">ایمیل</FormLabel>
                <FormControl>
                  <Input
                    className="text-right"
                    placeholder="آدرس ایمیل را وارد کنید"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-right w-full">رمز عبور</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="text-right"
                    placeholder="رمز عبور را وارد کنید"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              ورود
            </Button>
          </div>
          {/* <div className="text-sm text-right">
            با انجام ورود، با قوانین {APP_NAME} موافقت می‌کنید:{" "}
            <Link href="/page/conditions-of-use">شرایط استفاده</Link> و{" "}
            <Link href="/page/privacy-policy">قوانین و مقررات</Link>.
          </div> */}
        </div>
      </form>
    </Form>
  );
}
