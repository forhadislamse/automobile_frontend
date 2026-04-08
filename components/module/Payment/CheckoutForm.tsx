"use client";

import { useState } from "react";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirmPaymentMutation } from "@/redux/api/paymentApi";

interface CheckoutFormProps {
    clientSecret: string;
    orderId: string;
    planName: string;
    amount: number;
}

export default function CheckoutForm({ clientSecret, orderId, planName, amount }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [confirmPayment] = useConfirmPaymentMutation();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setIsProcessing(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
        } else if (paymentIntent.status === "succeeded") {
            try {
                // Confirm on backend
                await confirmPayment({
                    id: orderId,
                    paymentIntentId: paymentIntent.id
                }).unwrap();

                toast.success("Subscription activated successfully!");
                router.push("/user/reader");
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to finalize subscription");
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Secure Card Details
                </h3>

                <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 focus-within:border-blue-200 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#0F172A",
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
                        <p className="text-3xl font-black text-[#0F172A]">${amount}</p>
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full py-8 rounded-[1.5rem] bg-[#0F172A] hover:bg-gray-800 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-blue-900/10 transition-all active:scale-[0.98]"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-3">
                        <Loader2 className="animate-spin" /> 
                        Processing Securely...
                    </div>
                ) : (
                    `Activate ${planName} Plan`
                )}
            </Button>

            <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-green-500" />
                    SSL Secured
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={12} className="text-green-500" />
                    Instant Access
                </div>
            </div>
        </form>
    );
}
