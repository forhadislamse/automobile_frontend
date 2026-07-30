"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Home, MapPin, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  shopName: z.string().min(2, "Shop name is required"),
  shopAddress: z.string().min(5, "Shop address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Use, Privacy Policy and Fees",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const payload = {
        ...data,
        role: "SHOP_OWNER",
        gender: "Male" // default for now if not in form
      };
      
      const res = await registerUser(payload).unwrap() as any;
      if (res?.success || res?.token) {
        toast.success("Account created successfully!");
        setStep(2); // Move to Verification step
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to register. Please try again.");
    }
  };

  const steps = [
    { num: 1, label: "Shop Setup" },
    { num: 2, label: "Verification" },
    { num: 3, label: "Plan Selection" },
    { num: 4, label: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Container */}
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-8 sm:p-12">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 w-48 h-auto">
            <Image 
              src="/Logo.png" 
              alt="SmartAutoTech Logo" 
              width={200} 
              height={60} 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#0A1E44]">Shop Owner On-boarding</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold 
                  ${step === s.num ? "bg-[#3B5998] text-white" : "bg-[#E2E8F0] text-gray-500"}`}
                >
                  {s.num}
                </div>
                <span className="text-xs text-gray-600 mt-2 absolute translate-y-10">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 Form */}
        {step === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-8">
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Shop Owner Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Shop Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Home size={16} />
                </div>
                <input
                  type="text"
                  {...register("shopName")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Enter your shop name"
                />
              </div>
              {errors.shopName && <p className="text-red-500 text-xs mt-1">{errors.shopName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Shop Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={16} />
                </div>
                <input
                  type="text"
                  {...register("shopAddress")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Enter your shop location"
                />
              </div>
              {errors.shopAddress && <p className="text-red-500 text-xs mt-1">{errors.shopAddress.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone size={16} />
                </div>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Enter your Phone Number"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email Account</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Create your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800 text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1 mr-2 text-[#0A1E44] rounded focus:ring-[#0A1E44]"
              />
              <span className="text-xs text-gray-600">
                I agree to all <span className="font-semibold text-[#0A1E44]">Terms of Use</span>, <span className="font-semibold text-[#0A1E44]">Privacy Policy</span> and <span className="font-semibold text-[#0A1E44]">Fees</span>
              </span>
            </div>
            {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0A1E44] hover:bg-[#0A1E44]/90 text-white font-medium rounded-md py-3 mt-4 flex items-center justify-center transition-all disabled:opacity-70 text-sm"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
            </button>
          </form>
        )}
        
        {step > 1 && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto text-[#0A1E44] mb-4" size={40} />
            <h2 className="text-xl font-semibold text-gray-800">Processing Step {step}...</h2>
            <p className="text-gray-500 text-sm mt-2">Next steps (Verification & Plans) will be implemented here.</p>
          </div>
        )}

      </div>
    </div>
  );
}

