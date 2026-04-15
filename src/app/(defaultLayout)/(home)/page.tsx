"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetAllPlansQuery } from "@/redux/api/planApi";
import { 
  BadgeCheck, 
  Loader2, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Wrench
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import Logo from "@/src/assets/logo2.png";

// --- PRICING CARD COMPONENT (Individual Toggle) ---
const PricingCard = ({ plan, user }: { plan: any, user: any }) => {
    const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annually">("Monthly");
    const isCenter = plan.category === "PROFESSIONAL";
    
    const priceObj = plan.prices.find((p: any) => p.duration === billingCycle);
    const price = priceObj ? priceObj.price : 0;

    return (
        <div 
            className={`relative flex flex-col p-8 lg:p-10 rounded-[40px] transition-all duration-500 border-2 h-full ${
                isCenter 
                ? "bg-[#2b59ad] text-white border-transparent shadow-2xl scale-105 z-10" 
                : "bg-white text-slate-900 border-gray-100 shadow-xl hover:-translate-y-2"
            }`}
        >
            <div className="mb-6">
                <h3 className={`text-xl lg:text-2xl font-black mb-3 ${isCenter ? "text-white" : "text-[#0f172a]"}`}>
                    {plan.name}
                </h3>
                <p className={`text-sm font-medium leading-relaxed opacity-80 ${isCenter ? "text-blue-50" : "text-gray-500"}`}>
                    {plan.description}
                </p>
            </div>

            {/* Individual Billing Toggle (Matching Design) */}
            <div className="flex mb-8">
                <div className={`p-1 rounded-full flex gap-1 border ${
                    isCenter ? "bg-white/10 border-white/20" : "bg-gray-100/80 border-gray-200"
                }`}>
                    <button 
                        onClick={() => setBillingCycle("Monthly")}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                            billingCycle === "Monthly" 
                            ? (isCenter ? "bg-white text-[#2b59ad]" : "bg-[#0a1628] text-white shadow-md") 
                            : (isCenter ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900")
                        }`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle("Annually")}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                            billingCycle === "Annually" 
                            ? (isCenter ? "bg-white text-[#2b59ad]" : "bg-[#0a1628] text-white shadow-md") 
                            : (isCenter ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900")
                        }`}
                    >
                        Annually
                    </button>
                </div>
            </div>

            <div className="mb-10 flex items-baseline gap-1">
                <span className={`text-6xl font-black tracking-tight ${isCenter ? "text-white" : "text-[#0f172a]"}`}>
                    ${price}
                </span>
                <span className={`text-sm font-bold opacity-60 ${isCenter ? "text-blue-100" : "text-gray-400"}`}>
                    / Month
                </span>
            </div>

            <div className="mt-auto">
                <Link href={user ? `/checkout/${plan.id}?duration=${billingCycle}` : `/signup?redirect=/checkout/${plan.id}&duration=${billingCycle}`}>
                    <Button 
                        variant={isCenter ? "default" : "outline"}
                        className={`w-full py-8 rounded-2xl font-black text-lg transition-all active:scale-95 mb-10 ${
                            isCenter 
                            ? "bg-white text-[#2b59ad] hover:bg-gray-50 shadow-lg shadow-blue-900/20" 
                            : "bg-white border-2 border-slate-900/5 text-[#0f172a] hover:bg-slate-50"
                        }`}
                    >
                        {plan.category === "PROFESSIONAL" ? "Start 14 days free trial" : "Get Started Now"}
                    </Button>
                </Link>

                <ul className="space-y-4 text-left">
                    {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-4">
                            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                                isCenter ? "bg-white/10" : "bg-blue-50"
                            }`}>
                                <Check className={`w-3.5 h-3.5 ${isCenter ? "text-white" : "text-blue-600"}`} strokeWidth={3} />
                            </div>
                            <span className={`text-[15px] font-bold ${isCenter ? "text-blue-50" : "text-gray-600"}`}>
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function LandingPage() {
    const { data: plansData, isLoading: plansLoading } = useGetAllPlansQuery(undefined);
    const token = useAppSelector((state) => state.auth.token);
    const { data: userData } = useGetMeQuery(undefined, { skip: !token });
    const user = (userData as any)?.data;

    const plans = plansData?.data || [];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900 font-sans">
            
            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0a1628]">
                {/* Background effects */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                                <Sparkles className="w-3 h-3" /> Next-Gen Diagnostics
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight">
                                Smarter Solutions for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">
                                    Modern Repair Shops
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                                Empower your shop with AI-driven diagnostics, automated foreman assistance, and specialized vehicle repair intelligence. Reduce guesswork, save time, and grow your revenue.
                            </p>
                            <div className="flex flex-wrap justify-center gap-5">
                                <Link href="#pricing">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-full text-lg font-bold transition-all shadow-xl shadow-blue-900/40 group">
                                        View Pricing Plans <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href={token ? "#pricing" : "/shop-onboarding"}>
                                    <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:bg-white/5 bg-transparent px-10 py-8 rounded-full text-lg font-bold transition-all tracking-wide">
                                        Get Started Now
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-8">
                                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 ml-2 border-b border-blue-400/30 pb-1 transition-all">Login Securely</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 lg:py-32 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                        >
                            <div className="inline-block relative mb-4">
                                <span className="text-[#a02c2c] uppercase text-[10px] font-black tracking-[4px] relative px-8">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-[#a02c2c]/30" />
                                    Pricing
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-[#a02c2c]/30" />
                                </span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-[#0f172a] mb-6 tracking-tight leading-tight">
                                Simple, Transparent Pricing <br /> Built for Repair Shops
                            </h2>
                            <p className="text-lg text-gray-500 font-medium">
                                No hidden fees. No complicated tiers. Just powerful AI diagnostics that scale with your shop.
                            </p>
                        </motion.div>
                    </div>

                    <AnimatePresence mode="wait">
                        {plansLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                                <p className="text-gray-400 font-medium italic">Fetching professional plans from backend...</p>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch"
                            >
                                {plans.map((plan: any) => (
                                    <PricingCard key={plan.id} plan={plan} user={user} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-24 bg-[#0a1628] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-8 tracking-tight">
                        Ready to Transform Your Shop?
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg font-medium">
                        Join hundreds of shop owners who are already maximizing their efficiency with SmartAutoTech AI.
                    </p>
                    <Link href="/shop-onboarding">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-8 rounded-full text-xl font-bold shadow-2xl shadow-blue-900/40">
                             Get Started Now
                        </Button>
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8">
                             {/* Use absolute path to ensure logo works */}
                            <Image
                                src={Logo.src} 
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-black text-[#0f172a] uppercase italic">
                            SmartAuto<span className="text-blue-600">Tech</span>
                        </span>
                    </div>
                    <p className="text-gray-400 font-bold text-sm tracking-wide">
                        © 2026 SMARTAUTOTECH AI. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-sm font-bold text-gray-400 hover:text-[#0f172a] transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="text-sm font-bold text-gray-400 hover:text-[#0f172a] transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
