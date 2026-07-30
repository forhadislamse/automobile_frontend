/* eslint-disable react/no-unescaped-entities */

"use client";

import { useGetMyPaymentIdQuery } from "@/redux/api/planPaymentApi";
import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AccountForm } from "./account-form";

export default function SubscriptionSection() {
  const searchParams = useSearchParams();

  const planId = searchParams.get("planId") || "professional";
  const paymentId = searchParams.get("paymentId") || null;
  const durationParam = searchParams.get("duration") || "Monthly";

  // FIX: Read as plain string — no JSON.parse needed
  const clientSecret = localStorage.getItem("clientSecret") ?? "";
  console.log("clientSecret", clientSecret);

  const { data: planData, isLoading } = useGetMyPaymentIdQuery(paymentId || "");

  const plan = planData?.data;

  console.log("pla0n", plan);

  const duration = plan?.duration;
  const amount = plan?.amount;
  const features = plan?.plan?.features || [];
  const name = plan?.plan?.name || "";
  const hasTrial = plan?.plan?.hasTrial ?? false;
  const planPrice = plan?.planPrice;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading plan...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Plan not found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side */}
        <div className="w-full lg:w-[45%] bg-[#F3F6F3] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-serif">
                Complete Your Subscription
              </h1>
              {hasTrial && (
                <p className="mt-2 text-sm text-gray-500">
                  Start free — no charge for 14 days from today.
                </p>
              )}
            </div>

            {/* Plan Card */}
            <div className="bg-[#F4FDFF] border-2 border-primary rounded-2xl p-6 mb-10 shadow">
              <div className="flex justify-between items-center">
                <span className="text-md font-medium">{name}</span>

                <div className="flex items-start">
                  <span className="text-md">${amount}</span>
                  <span className="text-sm text-black ml-1">/{duration}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg md:text-xl mb-5">Plan Features</h3>

              <div className="space-y-4">
                {features?.map((feature: any, idx: number) => {
                  const isActive = typeof feature === "object" ? feature.isActive : true;
                  const featureName = typeof feature === "object" ? feature.name : feature;

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      {isActive ? (
                        <Check className="text-primary mt-1" size={20} />
                      ) : (
                        <div className="bg-gray-100 p-1 rounded-full shrink-0 mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400"
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      )}
                      <p className="text-sm font-medium">
                        {featureName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden text-center text-xs text-gray-400">
              Secure 256-bit SSL encrypted payment
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[55%] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="max-w-xl mx-auto">
            {hasTrial && (
              <div className="mb-6 rounded-xl bg-[#F4FDFF] border border-primary/30 px-5 py-4">
                <p className="text-[16px] font-semibold text-gray-800 mb-0.5">
                  You're starting a 14-day free trial
                </p>
                <p className="text-sm text-gray-500">
                  Enter your payment details to secure your plan. Your credit
                  card will{" "}
                  <span className="font-medium text-gray-700">
                    not be charged
                  </span>{" "}
                  until the trial period ends. After that, you'll be billed{" "}
                  <span className="font-semibold text-gray-800">
                    ${planPrice}/{duration}
                  </span>
                  .
                </p>
              </div>
            )}

            <AccountForm
              planId={plan.id}
              paymentId={paymentId}
              clientSecret={clientSecret}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

