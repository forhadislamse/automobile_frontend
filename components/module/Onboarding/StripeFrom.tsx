/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1F2937",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  },
};

interface Props {
  onSuccess: (paymentMethodId: string) => void;
  isSubmitting?: boolean;
}

export function BookingAndPaymentForm({
  onSuccess,
  isSubmitting = false,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleValidateCard = async () => {
    setPaymentError(null);
    setLoading(true);

    try {
      if (!stripe || !elements) {
        setPaymentError("Stripe not loaded");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        setPaymentError("Card details missing");
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error || !paymentMethod) {
        setPaymentError(error?.message ?? "Card validation failed");
        toast.error(error?.message ?? "Card validation failed");
        return;
      }

      toast.success("Card validated successfully");
      onSuccess(paymentMethod.id);
    } catch (err: any) {
      setPaymentError(err?.message ?? "Something went wrong");
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !stripe || loading || isSubmitting;

  return (
    <div className="w-full bg-white p-6 rounded-2xl space-y-6">
      <h3 className="text-lg font-semibold">Card Information</h3>

      <div className="space-y-2">
        <Label>Card Number *</Label>
        <div className="border p-3 rounded-xl bg-gray-50">
          <CardNumberElement
            options={cardStyle}
            onChange={() => setPaymentError(null)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Label>Expiry *</Label>
          <div className="border p-3 rounded-xl bg-gray-50">
            <CardExpiryElement
              options={cardStyle}
              onChange={() => setPaymentError(null)}
            />
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <Label>CVC *</Label>
          <div className="border p-3 rounded-xl bg-gray-50">
            <CardCvcElement
              options={cardStyle}
              onChange={() => setPaymentError(null)}
            />
          </div>
        </div>
      </div>

      {paymentError && (
        <Alert variant="destructive">
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        onClick={handleValidateCard}
        disabled={isDisabled}
        className="w-full bg-primary hover:bg-primary/90 py-6"
      >
        {loading ? <Loading /> : isSubmitting ? <Loading /> : "Continue"}
      </Button>
    </div>
  );
}
