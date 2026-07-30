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
import { Lock, Mail } from "lucide-react";
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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        const token = res.data.token;

        setCookie(token);

        const user = jwtDecode<CustomJwtPayload>(token);

        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

        if (user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b bg-white flex">
      {/* Left Sidebar */}
      <div className="w-1/2 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          {/* Logo */}
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

        <div className="flex justify-between ">
          <Image
            src="/images/Typing.png"
            alt="SmartAuto Logo"
            width={12000}
            height={12000}
            className="object-cover rounded-lg me-11"
            priority
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="text-blue-400 text-5xl">
                <Image src="/message.svg" alt="Logo" width={50} height={50} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome Back !
            </h1>
            <p className="text-[#4B5563] text-[16px]">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-[#4B5563] font-semibold hover:text-[#4B5563]/80"
              >
                Sign Up
              </a>
            </p>
          </div>

          {/* Form */}
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
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:text-blue-700 font-medium"
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

