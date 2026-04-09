"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreateSubscriptionIntentMutation, useConfirmPaymentMutation } from "@/redux/api/paymentApi";
import { toast } from "sonner";
import { ShieldCheck, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
    clientSecret: string;
    orderId: string;
    planName: string;
    amount: number;
    onPrev: () => void;
}

function CheckoutForm({ clientSecret, orderId, planName, amount, onPrev }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmPayment] = useConfirmPaymentMutation();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setIsProcessing(false);
            return;
        }

        const toastId = toast.loading("Processing your secure payment...");

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                toast.error(error.message || "Payment failed", { id: toastId });
                setIsProcessing(false);
            } else if (paymentIntent?.status === "succeeded") {
                await confirmPayment({
                    paymentId: orderId,
                    paymentIntentId: paymentIntent.id
                }).unwrap();

                toast.success("Subscription activated successfully!", { id: toastId });
                router.push("/dashboard");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to finalize subscription", { id: toastId });
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto w-full">
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    
                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <ShieldCheck size={16} />
                        Secure Card Details
                    </h3>

                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#0a1628",
                                        fontFamily: '"Outfit", sans-serif',
                                        "::placeholder": {
                                            color: "#94a3b8",
                                        },
                                    },
                                    invalid: {
                                        color: "#ef4444",
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">Total Payment</p>
                            <p className="text-3xl font-black text-[#0a1628] tracking-tighter">${amount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 leading-none">Plan Selected</p>
                          <p className="text-sm font-black text-[#0a1628]">{planName}</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="w-full py-6 rounded-[1.5rem] bg-[#0a1628] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="animate-spin" /> 
                            Activating...
                        </>
                    ) : (
                        `Activate ${planName} Plan`
                    )}
                </button>

                <div className="flex items-center justify-center gap-8 pt-4">
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-green-500" />
                        SSL Secured
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        <CheckCircle2 size={12} className="text-green-500" />
                        Instant Access
                    </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button type="button" onClick={onPrev} className="text-[9px] font-black text-gray-400 hover:text-[#0a1628] uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
                    <ChevronLeft size={14} /> Back to Plan Selection
                  </button>
                </div>
            </form>
        </div>
    );
}

export default function Step3_Payment({ onPrev, data }: any) {
    const [isInitializing, setIsInitializing] = useState(true);
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState("");
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const [createIntent] = useCreateSubscriptionIntentMutation();

    useEffect(() => {
        let isMounted = true;
        const initIntent = async () => {
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
                toast.error(err?.data?.message || "Failed to initialize subscription session");
            } finally {
                if (isMounted) setIsInitializing(false);
            }
        };

        const activeUserId = user?.id || data?.userId;
        if (activeUserId && data.selectedPlan?.id) {
            initIntent();
        } else {
            setIsInitializing(false);
        }

        return () => { isMounted = false; };
    }, [user?.id, data.userId, data.selectedPlan?.id, data.billingCycle, createIntent, router]);

    const amount = data.selectedPlan?.prices.find((p: any) => p.duration === data.billingCycle)?.price || 0;

    return (
        <Elements stripe={stripePromise}>
            <div className="relative min-h-[400px] flex items-center justify-center">
                {isInitializing && (
                    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin h-12 w-12 text-[#0a1628]" />
                        <p className="mt-4 text-[#0a1628] font-black uppercase tracking-widest text-xs">Initializing Secure Checkout...</p>
                    </div>
                )}

                {!isInitializing && clientSecret ? (
                    <CheckoutForm 
                        clientSecret={clientSecret} 
                        orderId={orderId} 
                        planName={data.selectedPlan?.name} 
                        amount={amount}
                        onPrev={onPrev}
                    />
                ) : (
                    !isInitializing && (
                        <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                             <p className="text-gray-400 font-bold mb-4 tracking-widest uppercase text-xs">Checkout could not be initialized</p>
                             <button onClick={onPrev} className="bg-[#0a1628] text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Go Back</button>
                        </div>
                    )
                )}
            </div>
        </Elements>
    );
}
