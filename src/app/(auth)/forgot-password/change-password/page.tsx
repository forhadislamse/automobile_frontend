"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
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

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!email) {
      toast.error("Email not found in URL");
      return;
    }

    try {
      const res = await resetPassword({ 
        email, 
        password: data.password 
      }).unwrap();

      if (res.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex w-full max-w-6xl items-center gap-10 lg:gap-24">
          <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0a1628] rounded-[2.5rem] min-h-[85vh] relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse" />
            <div className="relative z-10 text-center">
               <Image src="/logo2.png" alt="Logo" width={280} height={280} className="object-contain" priority />
               <div className="mt-8">
                  <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">
                    SmartAuto<span className="text-blue-500">Tech</span>
                  </h2>
               </div>
            </div>
          </div>

          <div className="w-full max-w-md animate-in zoom-in duration-500">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 text-center">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in duration-500" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-[#0a1628] tracking-tight mb-4">Well Done!</h1>
              <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10">
                Password Changed Successfully. You can now use your new password to log in to your account.
              </p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full py-8 rounded-2xl bg-[#0a1628] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl items-center gap-10 lg:gap-24">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0a1628] rounded-[2.5rem] min-h-[85vh] relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse" />
          <div className="relative z-10 text-center">
             <Image src="/logo2.png" alt="Logo" width={280} height={280} className="object-contain" priority />
             <div className="mt-8">
                <h2 className="text-white text-3xl font-black tracking-tighter uppercase italic">
                  SmartAuto<span className="text-blue-500">Tech</span>
                </h2>
                <p className="text-gray-400 font-medium tracking-[0.3em] text-[10px] mt-2">AI DRIVEN DIAGNOSTICS</p>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-500">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#0a1628] tracking-tight mb-3">Create a new password</h1>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Set your new password with minimum characters with a combination of letters and number.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500" />
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            {...field}
                            className="py-7 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500" />
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            {...field}
                            className="py-7 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full py-8 rounded-2xl bg-[#0a1628] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="animate-spin h-5 w-5" /> Processing...
                    </div>
                  ) : "Verify"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
