/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation() as any;

  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    router.push(`/forgot-password/otp?email=${data?.email}`);

    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-1/2 border-r border-slate-200 relative flex flex-col justify-between bg-[url('/Lo.png')] bg-cover bg-center">
        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <Image
              src="/r_logo.png"
              alt="SmartAuto Logo"
              width={200}
              height={200}
              className="h-52 w-52"
            />
          </div>
        </div>

        <div className="relative z-10 flex justify-between">
          <Image
            src="/images/Typing.png"
            alt="SmartAuto Logo"
            width={12000}
            height={12000}
            className="object-cover  rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-[40px] font-bold text-gray-800 mb-2">
              Forgot Password?
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                        <Input
                          type="email"
                          placeholder="email@gmail.com"
                          {...field}
                          className="py-6 pl-12 rounded-2xl"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full font-semibold rounded-lg py-6 transition-colors"
                disabled={isSubmitting}
              >
                Send OTP
              </Button>
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
    </div>
  );
}
