/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegistrationForm() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation() as any;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phoneNumber,
      password: data.password,
      role: "USER",
      fcmToken: ""
    };

    try {
      const res = await register(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful");
        router.push(`/register/verify-email?email=${payload.email}`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2 bg-[#0a1628] rounded-3xl p-12 flex items-center justify-center lg:min-h-[600px]">
          <Image
            src="/logo2.png"
            alt="Logo"
            className="w-48 h-auto object-contain"
            width={500}
            height={500}
          />
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Join Our Club
            </h2>
            <p className="text-gray-600">
              Create your Tennis Club membership account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...formRegister("fullName")}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.fullName?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  {...formRegister("email")}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.email?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  {...formRegister("phoneNumber")}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.phoneNumber?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...formRegister("password")}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.password?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...formRegister("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  {...formRegister("agreedToTerms")}
                  className="mt-1 w-4 h-4 text-[#a4d65e] border-gray-300 rounded focus:ring-[#a4d65e]"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms-privacy" className="text-[#f4d03f] hover:underline font-medium">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms-privacy" className="text-[#f4d03f] hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreedToTerms?.message && (
                <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-gray-800 font-semibold py-6 rounded-lg transition-colors mt-4"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-800 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
