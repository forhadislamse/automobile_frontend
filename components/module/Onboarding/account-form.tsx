/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";

import { usePaymentConfirmPaymentMutation } from "@/redux/api/planPaymentApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { BookingAndPaymentForm } from "./StripeFrom";
import { SuccessModal } from "./success-modal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface Props {
  planId: string;
  paymentId: string | null;
  clientSecret: string;
}

export function AccountForm({ planId, paymentId, clientSecret }: Props) {
  console.log("clientSecret", clientSecret);

  const router = useRouter();
  const params = useSearchParams();

  const [makeConfirmPayment, { isLoading: confirmLoading }] =
    usePaymentConfirmPaymentMutation();

  // const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = useCallback(
    async (paymentMethodId: string) => {
      if (!paymentMethodId) {
        toast.error("Please validate card first");
        return;
      }

      if (!clientSecret || !clientSecret.includes("_secret_")) {
        toast.error(
          "Payment session is invalid or expired. Please go back and select your plan again.",
        );
        console.error("Invalid clientSecret:", clientSecret);
        return;
      }

      setIsSubmitting(true);

      try {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe not loaded");

        // Detect intent type by prefix:
        // "seti_" = SetupIntent (trial — card saved, no charge)
        // "pi_"   = PaymentIntent (paid plan — card charged)
        const isSetupIntent = clientSecret.startsWith("seti_");

        let intentId: string | undefined;
        let stripeError: any;

        if (isSetupIntent) {
          const { setupIntent, error } = await stripe.confirmCardSetup(
            clientSecret,
            { payment_method: paymentMethodId },
          );
          intentId = setupIntent?.id;
          stripeError = error;
        } else {
          const { paymentIntent, error } = await stripe.confirmCardPayment(
            clientSecret,
            { payment_method: paymentMethodId },
          );
          intentId = paymentIntent?.id;
          stripeError = error;
        }

        if (stripeError) {
          toast.error(stripeError.message ?? "Payment failed");
          return;
        }

        if (!intentId) {
          toast.error("Something went wrong. Please try again.");
          return;
        }

        const payload = {
          paymentId,
          paymentIntentId: intentId,
        };

        const confirmRes = await makeConfirmPayment(payload).unwrap();

        console.log("confirmRes", confirmRes);
        if (confirmRes.success) {
          toast.success(confirmRes.message);
          localStorage.removeItem("clientSecret");
          
          const amount = confirmRes.data?.amount || confirmRes.data?.payment?.amount || 0;
          const orderId = confirmRes.data?.id || confirmRes.data?.payment?.id || paymentId || '';

          // setShowSuccess(true); // Uncomment if you want to show modal instead of direct redirect
          router.push(`/thank-you?amount=${amount}&orderId=${orderId}`);
        }
      } catch (err: any) {
        toast.error(err?.data?.message ?? err?.message ?? "Order failed");
      } finally {
        setIsSubmitting(false);
      }
    },
    [clientSecret, planId, makeConfirmPayment, router],
  );

  return (
    <Card className="p-6 border-0">
      <h2 className="text-2xl font-bold mb-6">Enter Account Details</h2>
      <Elements stripe={stripePromise}>
        <BookingAndPaymentForm
          onSuccess={onSuccess}
          isSubmitting={isSubmitting || confirmLoading}
        />
      </Elements>

      {/* 
      {showSuccess && (
        <SuccessModal
          open={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            router.push("/thank-you");
          }}
        />
      )} 
      */}
    </Card>
  );
}
