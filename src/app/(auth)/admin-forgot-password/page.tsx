/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForgotPasswordMutation } from "@/redux/api/authApi";
import { Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPassword() {
  const router = useRouter();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    router.push(`/admin-forgot-password/otp?email=${data.email}`);
    try {
      const res = (await forgotPassword(data).unwrap()) as any;

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Lo.png')" }}
    >
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8  w-full max-w-2xl  mx-auto my-auto flex flex-col justify-between">
        <div className="mb-6 text-center">
          <Image
            src="/r_logo.png"
            alt="Logo"
            width={250}
            height={250}
            className="mx-auto "
          />

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-500">
            Enter your email to receive a one-time password (OTP)
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        required
                        className="py-6 pl-12 rounded-lg"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-semibold py-6 transition-colors"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </Button>
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              <Button
                type="submit"
                variant="outline"
                className="w-full font-semibold py-6 transition-colors"
              >
                Back
              </Button>
            </Link>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
