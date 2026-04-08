"use client";

import { useGetPlanByIdQuery } from "@/redux/api/planApi";
import { useCreateSubscriptionIntentMutation } from "@/redux/api/paymentApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/module/Payment/CheckoutForm";
import { toast } from "sonner";
import { 
    Loader2, 
    ChevronLeft, 
    CreditCard, 
    ShieldCheck, 
    Zap,
    BadgeCheck
} from "lucide-react";
import Link from "next/link";

// Initialize Stripe outside of component to avoid recreation
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const planId = params.planId as string;
    
    const { data: planResult, isLoading: planLoading } = useGetPlanByIdQuery(planId);
    const isInitialMount = useRef(true);
    const [createSubscriptionIntent, { data: intentResult, isLoading: intentLoading }] = useCreateSubscriptionIntentMutation();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (planId && !clientSecret && !orderId && isInitialMount.current) {
            isInitialMount.current = false;
            createSubscriptionIntent({ planId })
                .unwrap()
                .then((res: any) => {
                    setClientSecret(res.data.clientSecret);
                    setOrderId(res.data.orderId);
                })
                .catch((err) => {
                    console.error("Failed to create intent", err);
                    isInitialMount.current = true; // Allow retry on failure
                    toast.error(err?.data?.message || "Payment session failed to initialize");
                });
        }
    }, [planId, createSubscriptionIntent, clientSecret, orderId]);

    if (planLoading || intentLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">Securing Payment Channel...</p>
            </div>
        );
    }

    const plan = planResult?.data;

    if (!plan || !clientSecret || !orderId) {
        return (
            <div className="text-center py-20 px-6 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Initialization Failed</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-10 italic">
                    We couldn't initialize the secure payment session. Please try again or contact support.
                </p>
                <Link href="/" className="text-blue-600 font-bold hover:underline py-2 px-4">
                    Return to Library
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                        <ChevronLeft size={16} /> 
                        Cancel & Return
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0F172A] p-1.5 rounded-lg">
                             <ShieldCheck size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-gray-900 uppercase tracking-tight text-sm">Secure Checkout</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Left: Secure Form */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                                Complete your <br />
                                subscription.
                            </h1>
                            <p className="text-gray-500 italic font-medium leading-relaxed">
                                Enter your payment details securely through Stripe. No card info is stored on our servers.
                            </p>
                        </div>

                        {clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm 
                                    clientSecret={clientSecret} 
                                    orderId={orderId} 
                                    planName={plan.name}
                                    amount={plan.price}
                                />
                            </Elements>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#1E293B] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16" />
                            
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-8 border-b border-white/10 pb-4">
                                Premium Subscription
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-2xl font-black leading-none mb-2">{plan.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider italic">Full Library Access</p>
                                </div>

                                <div className="space-y-3">
                                    {plan.features?.slice(0, 4).map((feature: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-[11px] font-medium text-gray-300">
                                            <BadgeCheck size={14} className="text-blue-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 mt-8 border-t border-white/10 flex items-end justify-between">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Recurring Price</div>
                                    <div className="text-3xl font-black">
                                        ${plan.price}
                                        <span className="text-sm font-normal text-gray-500 ml-1">/{plan.duration === 'yearly' ? 'yr' : 'mo'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="p-8 border border-gray-100 rounded-[2rem] bg-white flex items-center gap-4 shadow-sm italic">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Zap size={20} />
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-gray-900 text-sm leading-none mb-1">Instant Activation</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Unlocked immediately after payment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
