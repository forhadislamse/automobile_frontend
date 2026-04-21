/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type LoginFormValues = {
  email: string;
  password: string;
};
interface CustomJwtPayload extends JwtPayload {
  role: string; // Add the role property here
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation() as any;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        const { token, refreshToken, ...userProps } = res.data;

        const user = {
          id: userProps.id,
          email: userProps.email,
          role: userProps.role,
          fullName: userProps.fullName,
          profileImage: userProps.profileImage,
        };

        setCookie(token);
        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

        if (user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (user.role === "TECHNICIAN") {
          router.push("/user/diagnostics");
        } else if (user.role === "USER") {
          router.push("/user");
        } else {
          router.push("/");
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed. Please check your credentials.");
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
              <h1 className="text-3xl font-black text-[#0a1628] tracking-tight mb-3">Welcome Back !</h1>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Don't have an account? <Link href="/shop-onboarding" className="text-blue-500 hover:underline font-bold">Sign Up</Link>
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                          Password
                        </FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-[10px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 transition-colors group-focus-within:text-blue-500" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            className="py-7 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-3 py-2">
                   <div className="flex items-center gap-2">
                      <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                      <label htmlFor="remember" className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer">Remember me</label>
                   </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-8 rounded-2xl bg-[#0a1628] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="animate-spin" /> Signing In...
                    </div>
                  ) : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-12 text-center">
               <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
                 By clicking sign in, you agree to our <br />
                 <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors underline decoration-1 underline-offset-4">Terms of Services</Link> and <Link href="#" className="text-gray-400 hover:text-blue-500 transition-colors underline decoration-1 underline-offset-4">Privacy Policy</Link>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
