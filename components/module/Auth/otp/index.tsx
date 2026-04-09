/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^[A-Za-z0-9]$/, "Must be alphanumeric")
    )
    .length(6),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpProps {
  successRedirect?: (email: string) => string;
  successMessage?: string;
  verifyMutation?: any;
}

export default function Otp({
  successRedirect = (email) => `/forgot-password/change-password?email=${email}`,
  successMessage,
  verifyMutation
}: OtpProps) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reSendOtp] = useResendOtpMutation() as any;
  const [defaultVerifyOtp, { isLoading: isVerifyingOtpDefault }] = useVerifyOtpMutation() as any;
  const [providedVerifyOtp, { isLoading: isVerifyingOtpProvided }] = verifyMutation ? verifyMutation() : [null, { isLoading: false }];

  const verifiedOtp = verifyMutation ? providedVerifyOtp : defaultVerifyOtp;
  const isVerifyingOtp = verifyMutation ? isVerifyingOtpProvided : isVerifyingOtpDefault;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: Array(6).fill(""),
    },
  });

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      const res = await reSendOtp({ email: email }).unwrap();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6 - index);
      const newOtpValues = [...otpValues];

      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtpValues[index + i] = digit;
          setValue(`otp.${index + i}`, digit);
        }
      });

      setOtpValues(newOtpValues);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^[0-9]$/.test(value) || value === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setValue(`otp.${index}`, value);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    trigger("otp");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const router = useRouter();

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    const payload = { email: email, otp: Number(data.otp.join("")) };

    try {
      const res = await verifiedOtp(payload).unwrap();
      if (res.success) {
        toast.success(successMessage || res.message);
        router.push(successRedirect(email));
      } else {
        toast.error(res.message || "Failed to verify OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0a1628] tracking-tight mb-3 text-center">Enter Code</h1>
        <p className="text-gray-400 font-medium text-sm leading-relaxed text-center">
          We have sent a verification code to email address: <br />
          <span className="text-[#0a1628] font-bold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex-1">
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full aspect-square text-center text-2xl font-black rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-[#0a1628]"
              />
            </div>
          ))}
        </div>
        
        {errors.otp && (
          <p className="text-red-500 text-xs font-bold text-center -mt-4 animate-in fade-in slide-in-from-top-1">
            Please enter a valid 6-digit verification code.
          </p>
        )}

        <div className="text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Didn't get a code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 hover:text-blue-600 transition-colors ml-1 underline decoration-2 underline-offset-4"
            >
              Click to resend
            </button>
          </p>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={isVerifyingOtp || otpValues.some((v) => !v)}
            className="w-full py-8 rounded-2xl bg-[#0a1628] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/20 transition-all active:scale-[0.98]"
          >
            {isVerifyingOtp ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" /> Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </Button>

          <div className="text-center pt-4">
            <Link
              href="/forgot-password"
              className="text-[11px] font-black text-gray-400 hover:text-[#0a1628] uppercase tracking-[0.2em] transition-colors"
            >
              Back to Signin
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
