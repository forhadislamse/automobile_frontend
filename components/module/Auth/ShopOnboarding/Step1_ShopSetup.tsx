"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Store, MapPin, Phone, Mail, Lock } from "lucide-react";

const shopSetupSchema = z.object({
  fullName: z.string().min(1, "Owner name is required"),
  shopName: z.string().min(1, "Shop name is required"),
  shopAddress: z.string().min(1, "Shop address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useGetAllPlansQuery } from "@/redux/api/planApi";
import { useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { setUser } from "@/redux/features/authSlice";

type FormData = z.infer<typeof shopSetupSchema>;

export default function Step1_ShopSetup({ onNext, data }: any) {
  const dispatch = useDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(shopSetupSchema),
    defaultValues: data,
  });

  const handleFormSubmit = async (formData: FormData) => {
    try {
      // Always proceed with registration if we are on Step 1

      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        shopName: formData.shopName,
        shopAddress: formData.shopAddress,
        role: "USER"
      };
      console.log("Sending registration data:", registrationData);
      const res: any = await registerUser(registrationData).unwrap();

      if (res.success) {
        console.log("Registration Success Response:", res);
        toast.success("Account created successfully!");
        
        // Extract data properly
        const { user: newUser, token: newToken } = res.data;
        
        // 🚀 Sync State Immediately
        dispatch(setUser({ token: newToken, user: newUser }));
        
        // Pass IDs to the parent state as well
        onNext({ 
          ...formData, 
          userId: newUser.id, 
          token: newToken 
        });
      }
    } catch (err: any) {
      console.error("Registration Error Details:", {
        error: err,
        status: err?.status,
        message: err?.data?.message || err.message,
        data: err?.data
      });
      toast.error(err?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Owner Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Shop Owner Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("fullName")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
            {errors.fullName?.message && <p className="text-red-500 text-xs">{errors.fullName.message as string}</p>}
          </div>

          {/* Shop Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Shop Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("shopName")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="Enter your shop name"
              />
            </div>
            {errors.shopName?.message && <p className="text-red-500 text-xs">{errors.shopName.message as string}</p>}
          </div>
        </div>

        {/* Shop Address */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Shop Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              {...register("shopAddress")}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
              placeholder="Enter your shop location"
            />
          </div>
          {errors.shopAddress?.message && <p className="text-red-500 text-xs">{errors.shopAddress.message as string}</p>}
        </div>

        {/* Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("phoneNumber")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="Enter phone number"
              />
            </div>
            {errors.phoneNumber?.message && <p className="text-red-500 text-xs">{errors.phoneNumber.message as string}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                {...register("email")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="you@email.com"
              />
            </div>
            {errors.email?.message && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
          </div>
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                {...register("password")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="Create password"
              />
            </div>
            {errors.password?.message && <p className="text-red-500 text-xs">{errors.password.message as string}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                {...register("confirmPassword")}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all"
                placeholder="Confirm password"
              />
            </div>
            {errors.confirmPassword?.message && <p className="text-red-500 text-xs">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#0a1628] hover:bg-[#152a4a] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg mt-6 shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-0.5"
        >
          {isLoading ? "Creating Account..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

