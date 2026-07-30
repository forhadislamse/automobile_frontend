/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OnboardingLayout } from "@/components/module/Onboarding/onboarding-layout";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation, useRegisterMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  OnboardingProvider,
  useOnboarding,
} from "../../context/onboarding-context";

const shopSetupSchema = z
  .object({
    ownerName: z.string().min(1, "Owner name is required"),
    shopName: z.string().min(1, "Shop name is required"),
    shopAddress: z.string().min(1, "Shop address is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ShopSetupFormData = z.infer<typeof shopSetupSchema>;

function ShopSetupContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [createUser, { isLoading }] = useRegisterMutation();
  const [makeLogin, { isLoading: isLoginLoading }] = useLoginMutation();

  const { data, updateData, isLoaded } = useOnboarding();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ShopSetupFormData>({
    resolver: zodResolver(shopSetupSchema),
    defaultValues: {
      ownerName: data?.ownerName || "",
      shopName: data?.shopName || "",
      shopAddress: data?.shopAddress || "",
      phoneNumber: data?.phoneNumber || "",
      email: data?.email || "",
      password: data?.password || "",
      confirmPassword: data?.password || "",
      acceptTerms: data?.acceptTerms || false,
    },
  });

  // Load saved data when the context initializes from localStorage
  useEffect(() => {
    if (isLoaded) {
      reset({
        ownerName: data.ownerName || "",
        shopName: data.shopName || "",
        shopAddress: data.shopAddress || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
        password: data.password || "",
        confirmPassword: data.password || "",
        acceptTerms: data.acceptTerms || false,
      });
    }
  }, [isLoaded, reset, data]);

  // Save form progress to context as user types
  useEffect(() => {
    const subscription = watch((value) => {
      updateData({
        ownerName: value.ownerName || "",
        shopName: value.shopName || "",
        shopAddress: value.shopAddress || "",
        phoneNumber: value.phoneNumber || "",
        email: value.email || "",
        password: value.password || "",
        acceptTerms: value.acceptTerms || false,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateData]);

  const onSubmit = async (formData: ShopSetupFormData) => {
    const payload = {
      fullName: formData.ownerName,
      shopAddress: formData.shopAddress,
      shopName: formData.shopName,
      phone: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = (await createUser(payload).unwrap()) as any;

      if (res?.success) {
        toast.success(
          "Registration successful! Please select a plan to continue.",
        );

        const loginRes = (await makeLogin({
          email: formData.email,
          password: formData.password,
        }).unwrap()) as any;

        if (loginRes?.success) {
          const token = loginRes.data.token;

          setCookie(token);

          const user = jwtDecode<any>(token);

          dispatch(setUser({ token, user }));
        }

        router.push(`/register/verification-otp?email=${formData.email}`);
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Shop Owner Name */}
      <div className="space-y-2">
        <Label htmlFor="ownerName" className="text-gray-700">
          Shop Owner Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="ownerName"
            placeholder="Enter your name"
            className="pl-10 py-6"
            {...register("ownerName")}
          />
        </div>
        {errors.ownerName && (
          <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
        )}
      </div>

      {/* Shop Name */}
      <div className="space-y-2">
        <Label htmlFor="shopName" className="text-gray-700">
          Shop Name
        </Label>
        <div className="relative">
          <Store className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="shopName"
            placeholder="Enter your shop name"
            className="pl-10 py-6"
            {...register("shopName")}
          />
        </div>
        {errors.shopName && (
          <p className="text-red-500 text-sm">{errors.shopName.message}</p>
        )}
      </div>

      {/* Shop Address */}
      <div className="space-y-2">
        <Label htmlFor="shopAddress" className="text-gray-700">
          Shop Address
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="shopAddress"
            placeholder="Enter your shop location"
            className="pl-10 py-6"
            {...register("shopAddress")}
          />
        </div>
        {errors.shopAddress && (
          <p className="text-red-500 text-sm">{errors.shopAddress.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-gray-700">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="phoneNumber"
            placeholder="Enter your Phone Number"
            className="pl-10 py-6"
            {...register("phoneNumber")}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Email Account */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email Account
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10 py-6"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create your password"
            className="pl-10 py-6 pr-10"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-10 py-6 pr-10"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label
            htmlFor="terms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            I agree to all{" "}
            <Link
              href="/terms-of-use"
              className="text-[#042055] font-semibold hover:text-[#042055]/80 transition"
            >
              Terms of Use
            </Link>
            ,{" "}
            <Link
              href="/privacy-policy"
              className="text-[#042055] font-semibold hover:text-[#042055]/80 transition"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/fees-disclosure"
              className="text-[#042055] font-semibold hover:text-[#042055]/80 transition"
            >
              Fees
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        type="submit"
        className="w-full bg-[#042055] hover:bg-[#042055] text-white font-semibold py-6"
      >
        {isLoading ? <Loading /> : "Continue"}
      </Button>
    </form>
  );
}

export default function ShopSetupPage() {
  return (
    <OnboardingProvider>
      <OnboardingLayout currentStep={1}>
        <ShopSetupContent />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}
