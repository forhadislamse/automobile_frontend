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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgetPassword() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation() as any;

  const form = useForm<FieldValues>({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
    })),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await forgotPassword(data).unwrap();
      if (res.success) {
        toast.success(res.message || "OTP sent successfully!");
        router.push(`/forgot-password/otp?email=${data?.email}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl items-center gap-10 lg:gap-24">
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-[#0a1628] rounded-[2.5rem] min-h-[85vh] relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse" />
          <div className="relative z-10 text-center animate-in fade-in zoom-in duration-700">
             <Image
                src="/logo2.png"
                alt="Logo"
                width={280}
                height={280}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
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
              <h1 className="text-3xl font-black text-[#0a1628] tracking-tight mb-3">Forgot Password</h1>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Enter your registered email below. We'll send you a verification code to reset your account.
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Email Account
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
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
                       <Loader2 className="animate-spin" /> Sending...
                    </div>
                  ) : "Get OTP"}
                </Button>
              </form>
            </Form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <Link
                href="/login"
                className="text-[11px] font-black text-gray-400 hover:text-[#0a1628] uppercase tracking-[0.2em] transition-colors"
              >
                Back to Signin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
