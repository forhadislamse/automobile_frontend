/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCreateSubscriptionIntentMutation,
  useGetAllSubscriptionQuery,
} from "@/redux/api/subscriptionApi";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PlanSelectionSkeleton from "./PlanSelectionSkeleton";

type BillingPeriod = "monthly" | "annual";
type ApiDuration = "Monthly" | "Annually";

interface Price {
  duration: ApiDuration;
  price: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  technicianLimit: number;
  hasTrial: boolean;
  baseIncludedText?: string;
  features: (string | { name: string; isActive: boolean })[];
  prices: Price[];
}

const formatDuration = (period: BillingPeriod): ApiDuration =>
  period === "monthly" ? "Monthly" : "Annually";

const getPlanPrice = (plan: SubscriptionPlan, period: BillingPeriod) => {
  return (
    plan.prices.find((p) =>
      period === "monthly"
        ? p.duration === "Monthly"
        : p.duration === "Annually",
    )?.price ?? 0
  );
};

const getMonthlyFromAnnual = (plan: SubscriptionPlan) => {
  const annual = plan.prices.find((p) => p.duration === "Annually")?.price ?? 0;
  return Math.floor(annual / 12);
};

const getYearlySavings = (plan: SubscriptionPlan) => {
  const monthly = plan.prices.find((p) => p.duration === "Monthly")?.price ?? 0;
  const annual = plan.prices.find((p) => p.duration === "Annually")?.price ?? 0;
  return monthly * 12 - annual;
};

export default function PlanSelection() {
  const router = useRouter();

  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data, isLoading } = useGetAllSubscriptionQuery({}) as any;
  const plans: SubscriptionPlan[] = data?.data || [];

  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionIntentMutation();

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlanId(planId);

    const payload = {
      planId,
      duration: formatDuration(billingPeriod),
    };

    try {
      const res = (await createSubscription(payload).unwrap()) as any;

      if (res?.success) {
        toast.success(
          res?.data?.message ||
          "Subscription intent created! Redirecting to payment...",
        );

        if (res?.data?.orderId) {
          // FIX: Store clientSecret as a plain string (no JSON.stringify)
          // Only store if the value actually exists
          if (res.data.clientSecret) {
            localStorage.setItem("clientSecret", res.data.clientSecret);
          } else {
            console.warn("No clientSecret returned from server");
          }

          router.push(
            `/register/payment?paymentId=${res.data.orderId}&planId=${planId}`,
          );
        }
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
        "Failed to create subscription intent. Please try again.",
      );
      console.error("Subscription error:", err);
    } finally {
      setLoadingPlanId(null);
    }
  };

  if (isLoading) return <PlanSelectionSkeleton />;

  return (
    <main className="min-h-screen bg-white px-4 pb-20">
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isFeatured = index === 1;

          const price = getPlanPrice(plan, billingPeriod);
          const savings = getYearlySavings(plan);
          const monthlyEquivalent = getMonthlyFromAnnual(plan);

          return (
            <Card
              key={plan.id}
              className={`p-8 flex flex-col ${isFeatured
                ? "bg-linear-to-b from-[#4d73bc] to-[#103376] text-white scale-105"
                : "border-2 border-gray-200"
                }`}
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-sm mt-2 opacity-80">{plan.description}</p>

              <div className="my-4 flex justify-center">
                <div className="inline-flex rounded-full bg-gray-100 p-1">
                  {(["monthly", "annual"] as BillingPeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => setBillingPeriod(period)}
                      className={`px-4 py-1 rounded-full text-sm capitalize ${billingPeriod === period
                        ? "bg-[#042055] text-white"
                        : "text-gray-600"
                        }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <span className="text-5xl font-bold">
                  ${billingPeriod === "annual" ? monthlyEquivalent : price}
                </span>
                <span className="ml-2 text-sm">
                  /month {billingPeriod === "annual" && "(billed yearly)"}
                </span>
              </div>

              {(plan as any).baseIncludedText && (
                <p
                  className={`text-sm font-bold mb-4 ${isFeatured ? "text-white" : "text-gray-900"
                    }`}
                >
                  {(plan as any).baseIncludedText}
                </p>
              )}

              {billingPeriod === "annual" && savings > 0 && (
                <p className="text-xs mb-4 text-green-400">
                  Save ${savings}/year
                </p>
              )}

              {plan.hasTrial && (
                <p className="text-xs mb-2 font-medium text-blue-300">
                  ✓ Free trial available
                </p>
              )}

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loadingPlanId === plan.id}
                className={`mb-6 mt-4 font-semibold py-3 ${plan.hasTrial
                  ? "bg-white text-[#042055]"
                  : "bg-[#042055] text-white"
                  }`}
              >
                {loadingPlanId === plan.id ? (
                  <Loading />
                ) : plan.hasTrial ? (
                  "Start 14 days free trial"
                ) : (
                  "Get Started"
                )}
              </Button>

              <p className="text-md font-semibold opacity-70 mb-3">
                {plan.technicianLimit} technician
                {plan.technicianLimit > 1 && "s"}
              </p>

              <div className="space-y-3">
                {plan.features.map((feature, i) => {
                  const isActive = typeof feature === "object" ? (feature as any).isActive : true;
                  const featureName = typeof feature === "object" ? (feature as any).name : feature;

                  return (
                    <div
                      key={i}
                      className="flex gap-2 items-center"
                    >
                      {isActive ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="bg-gray-100 p-0.5 rounded-full shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
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
                      <span className="text-sm">
                        {featureName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
