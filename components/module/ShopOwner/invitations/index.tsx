/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddTechnicianMutation,
  useGetTechniciansLimitInfoQuery,
} from "@/redux/api/shopOwnerDashboardApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const technicianSchema = z.object({
  name: z.string().min(1, "Technician name is required"),
  email: z.string().email("Please enter a valid email address"),
  passkey: z.string().min(8, "Passkey must be at least 8 characters"),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

export default function AddTechnicianPage() {
  const router = useRouter();

  const { data: limitInfoData } = useGetTechniciansLimitInfoQuery({});
  const [makeInvitation, { isLoading }] = useAddTechnicianMutation();

  const limitInfo = limitInfoData?.data;

  console.log("limitInfo", limitInfo);

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
  });

  const onSubmit = async (data: TechnicianFormData) => {
    const payload = {
      fullName: data.name,
      email: data.email,
      passkey: data.passkey,
    };

    try {
      const res = await makeInvitation(payload).unwrap();
      toast.success(res.message || "Invitation sent successfully!");

      router.push("/shop-owner/dashboard/technician-management");
    } catch (error: any) {
      console.error("Failed to send invitation:", error);

      toast.error(error?.data?.message || "Failed to send invitation.");
    }

    reset();
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg p-8">
        <h1 className="text-[32px] font-bold text-gray-900 mb-8">
          Add Technician
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Technician Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Technician Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Enter technician name"
                {...register("name")}
                className="pl-10 border-gray-300 py-6 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Technician Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Technician Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter technician email address"
                {...register("email")}
                className="pl-10 border-gray-300 py-6 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Passkey */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Passkey
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create technician passkey"
                {...register("passkey")}
                className="pl-10 pr-10 border-gray-300 py-6 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.passkey && (
              <p className="text-red-600 text-sm mt-1">
                {errors.passkey.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-6 rounded-lg mt-8"
          >
            {isLoading ? <Loading /> : "Send Invitation"}
          </Button>

          <div className="bg-red-50 rounded-lg p-4 mt-6">
            <p className="text-red-600 text-center text-sm font-medium">
              You have {limitInfo?.[0]?.remaining} invitation remaining
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
