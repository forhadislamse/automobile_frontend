/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Eye, Lock, Mail } from "lucide-react";
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
  role: string;
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function LoginPage() {
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

  const setCredentials = (email: string) => {
    form.setValue("email", email);
    form.setValue("password", "12345678");
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      console.log("res", res);

      if (res.success) {
        const token = res.data.token;

        setCookie(token);

        const user = jwtDecode<CustomJwtPayload>(token);

        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

        if (user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (user?.role === "USER") {
          router.push("/shop-owner/dashboard");
        } else if (user?.role === "TECHNICIAN") {
          router.push("/chat");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b bg-white flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <div className="relative flex min-h-[320px] flex-col justify-center overflow-hidden border-b border-slate-200 lg:min-h-screen lg:w-1/2 lg:border-b-0 lg:border-r">
        {/* Background Image with subtle overlay */}
        {/* <div className="absolute inset-0 bg-[url('/Lo.png')] bg-cover bg-center"></div> */}
        {/* <div className="absolute inset-0 bg-black/25"></div> */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-5 px-6 py-6 lg:space-y-6 lg:py-10">
          {/* Logo */}
          {/* <Image
            src="/r_logo.png"
            alt="SmartAuto Logo"
            width={180}
            height={180}
            className="h-48 w-48 rounded-full shadow-lg animate-bounce"
          /> */}

          {/* Lottie Animation */}
          <div className="w-full max-w-[560px]">
            {/* <Lottie
              animationData={animationData}
              loop
              autoplay
              className="w-full h-full"
            /> */}
            <img
              src="/video/video.gif"
              alt="animation"
              width={500}
              height={500}
              className="mx-auto h-[220px] w-full object-contain sm:h-[300px] lg:h-[420px] xl:h-[500px]"
            />
          </div>

          <Link href="https://smartautotech.shop/LoginDoc" target="_blank" className="w-full max-w-xs">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 py-5 font-medium"
            >
              <Eye size={16} />
              Quick Start Guide
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-primary text-5xl">
                <Link href="/">
                  <Image
                    src="/r_logo.png"
                    alt="SmartAuto Logo"
                    width={180}
                    height={180}
                    className="h-48 w-48 object-contain"
                  />
                </Link>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-[#4B5563] text-[16px]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#4B5563] font-semibold hover:text-[#4B5563]/80"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PHInput
                control={form.control}
                name="email"
                label="Email"
                icon={Mail}
                type="email"
                placeholder="Enter your email"
              />
              <PHInput
                control={form.control}
                name="password"
                label="Password"
                icon={Lock}
                type="password"
                placeholder="Enter your password"
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Quick Login Buttons for Testing */}
              <div className="flex flex-col gap-2 pt-2 pb-2">
                <span className="text-xs text-gray-500 font-medium">Quick Login (Test Accounts):</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCredentials("admin@gmail.com")}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-md transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials("rforhadewu@gmail.com")}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-md transition-colors"
                  >
                    Shopowner
                  </button>
                  <button
                    type="button"
                    onClick={() => setCredentials("i.rforhad@gmail.com")}
                    className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-md transition-colors"
                  >
                    Technician
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 font-semibold"
              >
                {isLoading ? <Loading /> : "Sign In"}
              </Button>

            </form>
          </FormProvider>

          {/* Terms & Privacy */}
          <div className="flex justify-center w-full">
            <p className="text-xs text-slate-600 text-center mt-6">
              By signing up, you agree to our{" "}
              <Link
                href="/terms-of-use"
                className="text-primary hover:text-blue-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:text-blue-700 font-medium"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
