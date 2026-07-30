/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
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
import { useResetPasswordMutation } from "@/redux/api/authApi";

import { Eye, EyeOff, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();

  const [resetPassword, { isLoading }] = useResetPasswordMutation() as any;

  const form = useForm<FieldValues>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  const watchNewPassword = form.watch("newPassword");
  const watchConfirmPassword = form.watch("confirmPassword");
  const isPasswordMatch =
    watchNewPassword &&
    watchConfirmPassword &&
    watchNewPassword === watchConfirmPassword;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log("Resetting password with:", data);

    const payload = {
      email: email,
      password: data?.confirmPassword,
    };

    const res = await resetPassword(payload).unwrap();
    if (res.success) {
      toast.success(res.message);
      router.push("/login");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel */}
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-[30px] font-bold text-gray-800 mb-2">
              Create a new password
            </h2>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="py-6 pr-12  ps-12 rounded-2xl"
                        />
                        <button
                          type="button"
                          onClick={toggleNewPassword}
                          className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                          {showNewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter new password"
                          {...field}
                          className="py-6 ps-12 pr-12 rounded-2xl"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPassword}
                          className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 rounded-lg py-6 font-medium transition-colors"
                disabled={isSubmitting || !isPasswordMatch}
              >
                {isSubmitting ? <Loading /> : "Change Password"}
              </Button>

              {/* Show password mismatch error */}
              {!isPasswordMatch && watchConfirmPassword && (
                <p className="text-sm text-red-500 font-medium text-center -mt-4">
                  Passwords do not match.
                </p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
