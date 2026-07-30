/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  ChevronDown,
  ImageIcon,
  Lock,
  Mail,
  Phone,
  User,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

const step2Schema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegistrationForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoError, setPhotoError] = useState<string>("");
  const [step1Data, setStep1Data] = useState<any>(null);

  const [register, { isLoading }] = useRegisterMutation() as any;

  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
    getValues: getValuesStep1,
    setValue: setValueStep1,
    reset: resetStep1,
  } = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      skillLevel: "",
      phoneNumber: "",
    },
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
    getValues: getValuesStep2,
    setValue: setValueStep2,
    reset: resetStep2,
  } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedStep1Data = localStorage.getItem("step1Data");
    const savedStep2Data = localStorage.getItem("step2Data");
    const savedPhotoPreview = localStorage.getItem("photoPreview");

    if (savedStep1Data) {
      const parsedStep1Data = JSON.parse(savedStep1Data);
      setStep1Data(parsedStep1Data);

      resetStep1(parsedStep1Data);
    }

    if (savedStep2Data) {
      const parsedStep2Data = JSON.parse(savedStep2Data);

      resetStep2({
        email: parsedStep2Data.email || "",
        password: "",
        confirmPassword: "",
        agreedToTerms: parsedStep2Data.agreedToTerms || false,
      });
    }

    if (savedPhotoPreview) {
      setPhotoPreview(savedPhotoPreview);
    }
  }, [resetStep1, resetStep2]);

  // Load Step 1 data when returning to Step 1
  useEffect(() => {
    if (step === 1 && step1Data) {
      resetStep1(step1Data);
    }
  }, [step, step1Data, resetStep1]);

  // Load Step 2 data when going to Step 2
  useEffect(() => {
    if (step === 2) {
      const savedStep2Data = localStorage.getItem("step2Data");
      if (savedStep2Data) {
        const parsedStep2Data = JSON.parse(savedStep2Data);
        resetStep2({
          email: parsedStep2Data.email || "",
          password: "",
          confirmPassword: "",
          agreedToTerms: parsedStep2Data.agreedToTerms || false,
        });
      }
    }
  }, [step, resetStep2]);

  // Update localStorage whenever step 1 form data changes
  useEffect(() => {
    if (step1Data) {
      localStorage.setItem("step1Data", JSON.stringify(step1Data));
    }
  }, [step1Data]);

  const handlePhotoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      localStorage.setItem("photoPreview", preview);
      setPhotoError("");
    } else {
      setPhotoError("");
    }
  };

  const onStep1Submit = (data: any) => {
    console.log("Step 1 Data:", {
      ...data,
      photo: photo ? "Photo uploaded" : "No photo",
    });

    // Save step 1 data to state and localStorage
    setStep1Data(data);
    localStorage.setItem("step1Data", JSON.stringify(data));

    setStep(2);
  };

  const onStep2Submit = async (data: any) => {
    // Save step 2 data to localStorage (excluding password for security)
    const step2DataToSave = {
      email: data.email,
      agreedToTerms: data.agreedToTerms,
    };
    localStorage.setItem("step2Data", JSON.stringify(step2DataToSave));

    const payload = {
      firstName: step1Data.firstName,
      lastName: step1Data.lastName,
      email: data.email,
      password: data.password,
      skillLevel: step1Data.skillLevel,
      dateOfBirth: step1Data.dateOfBirth,
      phoneNumber: step1Data.phoneNumber,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(payload));

    if (photo) {
      formData.append("image", photo);
    }
    console.log("formData", formData);

    try {
      const res = await register(formData).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful");

        setStep1Data(null);
        setPhoto(null);
        setPhotoPreview("");
        localStorage.removeItem("step1Data");
        localStorage.removeItem("step2Data");
        localStorage.removeItem("photoPreview");

        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  const handleBackToStep1 = () => {
    // Save current step 2 data before going back
    const currentStep2Data = getValuesStep2();
    const step2DataToSave = {
      email: currentStep2Data.email,
      agreedToTerms: currentStep2Data.agreedToTerms,
    };
    localStorage.setItem("step2Data", JSON.stringify(step2DataToSave));

    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full rounded-3xl p-12 flex items-center justify-center lg:min-h-200">
          <Image
            src="/images/otp.jpg"
            alt="Tennis"
            className="w-full h-full object-cover"
            width={1000}
            height={1000}
          />
        </div>

        <div className="w-full bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Join Our Club
            </h2>
            <p className="text-gray-600">
              Create your Tennis Club membership account
            </p>
          </div>

          {step === 1 ? (
            <form
              onSubmit={handleSubmitStep1(onStep1Submit)}
              className="space-y-6"
            >
              <div className="flex flex-col items-center">
                <label className="text-sm font-medium text-gray-700 mb-3 self-start">
                  Upload your photo (Optional)
                </label>
                <label className="w-24 h-24 border-2 border-dashed border-[#a4d65e] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      width={500}
                      height={500}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photoError && (
                  <p className="text-red-500 text-sm mt-2">{photoError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...registerStep1("firstName")}
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep1.firstName?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep1.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    {...registerStep1("lastName")}
                    placeholder="Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep1.lastName?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep1.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number*
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    {...registerStep1("phoneNumber")}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep1.phoneNumber?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep1.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth*
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    {...registerStep1("dateOfBirth")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep1.dateOfBirth?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep1.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level*
                </label>
                <div className="relative">
                  <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    {...registerStep1("skillLevel")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all appearance-none bg-white"
                  >
                    <option value="">Select skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {errorsStep1.skillLevel?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep1.skillLevel.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-gray-800 font-semibold py-6 rounded-lg transition-colors"
              >
                Next
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-800 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitStep2(onStep2Submit)}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address*
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    {...registerStep2("email")}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep2.email?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep2.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    {...registerStep2("password")}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep2.password?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep2.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    {...registerStep2("confirmPassword")}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a4d65e] focus:border-transparent outline-none transition-all"
                  />
                </div>
                {errorsStep2.confirmPassword?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep2.confirmPassword.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...registerStep2("agreedToTerms")}
                    className="mt-1 w-4 h-4 text-[#a4d65e] border-gray-300 rounded focus:ring-[#a4d65e]"
                  />
                  <label className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-[#f4d03f] hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-[#f4d03f] hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errorsStep2.agreedToTerms?.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsStep2.agreedToTerms.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-gray-800 font-semibold py-6 rounded-lg transition-colors"
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBackToStep1}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
              >
                ← Back
              </Button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-gray-800 font-semibold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
