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

// OTP SCHEMA FOR 6 DIGITS
const otpSchema = z.object({
  otp: z
    .array(
      z
        .string()
        .length(1)
        .regex(/^[A-Za-z0-9]$/, "Must be alphanumeric"),
    )
    .length(6),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function Otp() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [reSendOtp] = useResendOtpMutation() as any;
  const [verifiedOtp, { isLoading: isVerifyingOtp }] =
    useVerifyOtpMutation() as any;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

  // TIMER
  const [timeLeft, setTimeLeft] = useState(300);
  const [isCounting, setIsCounting] = useState(true);

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

  const router = useRouter();

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // TIMER EFFECT
  useEffect(() => {
    if (!isCounting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCounting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCounting]);

  // AUTO FOCUS
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // RESEND OTP
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    try {
      const res = await reSendOtp({ email }).unwrap();

      if (res.success) {
        toast.success(res.message);

        setTimeLeft(300);
        setIsCounting(true);
      } else {
        toast.error(res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // INPUT CHANGE
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

  // KEYBOARD NAVIGATION
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // SUBMIT
  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    const payload = { email, otp: Number(data.otp.join("")) };

    try {
      const res = await verifiedOtp(payload).unwrap();
      console.log("res", res);

      if (res.success) {
        toast.success(res.message);
        router.push(`/forgot-password/otp/change-password?email=${email}`);
      } else {
        toast.error(res.message || "Failed to verify OTP");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8">
            <div className="text-center mb-8">
              <h1 className="text-[30px] font-bold mb-2">
                Enter verification code
              </h1>
              <p className="text-gray-600">We’ve sent a code to {email}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP INPUTS */}
              <div className="flex gap-3 justify-between">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el) as any}
                    type="text"
                    inputMode="numeric"
                    value={otpValues[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full aspect-square text-center text-xl border rounded-lg"
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="text-red-500 text-sm text-center mt-2">
                  Please enter a valid 6-digit code
                </p>
              )}

              {/* RESEND */}
              <div className="text-center">
                Didn’t get a code?{" "}
                {isCounting ? (
                  <span className="text-gray-500">
                    Resend in {formatTime(timeLeft)}
                  </span>
                ) : (
                  <span
                    onClick={handleResendOtp}
                    className="font-semibold cursor-pointer hover:underline"
                  >
                    Click to resend
                  </span>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isVerifyingOtp || otpValues.some((v) => !v)}
                  className="w-full bg-primary cursor-pointer text-white py-3 rounded-lg"
                >
                  {isVerifyingOtp ? "Loading..." : "Verify OTP"}
                </button>

                <Link href="/forgot-password" className="w-full">
                  <Button variant="outline" className="w-full py-6">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
