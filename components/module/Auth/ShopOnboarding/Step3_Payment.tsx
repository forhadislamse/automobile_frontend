"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreateSubscriptionIntentMutation, useConfirmPaymentMutation } from "@/redux/api/paymentApi";
import { useRegisterMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { ShieldCheck, CreditCard, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import { useEffect } from "react";

function CheckoutForm({ onPrev, data }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  
  const [createIntent] = useCreateSubscriptionIntentMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  // Create Intent on Mount
  useEffect(() => {
    let isMounted = true;
    const initIntent = async () => {
      if (!isMounted) return;
      setIsInitializing(true);
      try {
        const intentRes: any = await createIntent({
          planId: data.selectedPlan?.id,
          duration: data.billingCycle
        }).unwrap();

        if (intentRes.success && isMounted) {
          if (intentRes.data?.trialStarted) {
            toast.success(intentRes.data.message || "Trial started!");
            router.push("/dashboard");
          } else {
            setClientSecret(intentRes.data?.clientSecret);
            setOrderId(intentRes.data?.orderId);
          }
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to initialize payment. Redirecting...");
        // If it fails, maybe go back to plan selection
        setTimeout(() => onPrev(), 2000);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    if (data.userId && data.selectedPlan?.id) {
        initIntent();
    } else {
        setIsInitializing(false);
    }

    return () => { isMounted = false; };
  }, [data.userId, data.selectedPlan?.id, data.billingCycle, createIntent, router, onPrev]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) {
        if (!clientSecret && !isInitializing) {
            toast.error("Payment session not initialized. Please try again.");
        }
        return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Confirming your payment...");

    try {
      // 1. Confirm with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: data.fullName,
            email: data.email
          }
        }
      });

      if (error) throw new Error(error.message);

      // 2. Confirm in our backend
      await confirmPayment({
        paymentId: orderId, // Use the stored orderId from backend
        paymentIntentId: paymentIntent.id
      }).unwrap();

      toast.success("Subscription completed successfully!", { id: toastId });
      router.push("/dashboard");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {isInitializing && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1628]"></div>
            <p className="mt-4 text-[#0a1628] font-bold animate-pulse text-lg">Initializing secure session...</p>
            <p className="text-sm text-gray-400 mt-2">Setting up your secure checkout</p>
        </div>
      )}
      
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Summary Side */}
      <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-[#0a1628] mb-4">Complete Your Subscription</h3>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 mb-6 flex justify-between items-center shadow-sm">
          <div>
            <p className="font-bold text-[#0a1628]">{data.selectedPlan?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{data.billingCycle} Billing</p>
          </div>
          <span className="text-xl font-black text-[#0a1628]">
            ${data.selectedPlan?.prices.find((p: any) => p.duration === data.billingCycle)?.price || 0}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm font-bold text-gray-700">Plan Features</p>
          {data.selectedPlan?.features.slice(0, 4).map((f: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              {f}
            </div>
          ))}
        </div>

        <button onClick={onPrev} className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#0a1628] transition-colors font-semibold">
          <ChevronLeft className="w-4 h-4" /> Change Plan
        </button>
      </div>

      {/* Payment Side */}
      <form onSubmit={handleSubmit} className="w-full md:w-1/2 space-y-6">
        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Card Information
          </p>
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-[#0a1628] transition-all">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0a1628',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }} />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-gray-700">Cardholder Name</p>
          <input 
            type="text" 
            defaultValue={data.fullName}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0a1628] outline-none transition-all placeholder:text-gray-300" 
            placeholder="Name on card" 
          />
        </div>

        <button 
          disabled={!stripe || isProcessing}
          type="submit"
          className="w-full bg-[#0a1628] hover:bg-[#152a4a] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/10 transition-all"
        >
          {isProcessing ? "Processing..." : "Complete Subscription"}
        </button>
      </form>
    </div>
    </div>
  );
}

export default function Step3_Payment(props: any) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}
