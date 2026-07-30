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

const AdminLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = (await login(data).unwrap()) as any;

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
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/Lo.png')" }}
    >
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-md z-10">
        <Link href="/">
          <Image
            src="/r_logo.png"
            alt="Logo"
            width={250}
            height={250}
            className="mx-auto rounded-2xl"
          />
        </Link>

        <h1 className="text-center text-[36px] font-semibold">Welcome Back</h1>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mb-[70px]"
          >
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
                href="/admin-forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 font-semibold"
            >
              {isLoading ? <Loading /> : "Login"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AdminLogin;
