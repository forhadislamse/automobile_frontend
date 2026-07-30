"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetAllPlansQuery } from "@/redux/api/planApi";
import { 
  Check, 
  Lock,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  BarChart3,
  Wrench,
  Zap,
  CheckCircle2,
  ChevronDown,
  Quote,
  Star
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/hooks";
import { useGetMeQuery } from "@/redux/api/authApi";
import Logo from "@/src/assets/logo2.png";

interface PlanFeature {
  name: string;
  isActive: boolean;
}

// --- COMPONENTS ---

const PricingCard = ({ plan, user }: { plan: any, user: any }) => {
    const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annually">("Monthly");
    const isCenter = plan.category === "PROFESSIONAL";
    
    const priceObj = plan.prices.find((p: any) => p.duration === billingCycle);
    const price = priceObj ? priceObj.price : 0;

    return (
        <div className={`relative flex flex-col p-8 lg:p-10 rounded-3xl transition-all duration-500 border h-full ${
            isCenter 
            ? "bg-[#1F2937] text-white border-transparent shadow-2xl scale-105 z-10 shadow-orange-500/20" 
            : "bg-white/80 backdrop-blur-xl text-gray-900 border-gray-200 shadow-xl hover:-translate-y-2 hover:shadow-orange-100"
        }`}>
            <div className="mb-6 text-center">
                <h3 className={`text-xl lg:text-2xl font-bold mb-3 tracking-tight ${isCenter ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                </h3>
                <p className={`text-sm font-medium leading-relaxed ${isCenter ? "text-gray-400" : "text-gray-500"}`}>
                    {plan.description}
                </p>
            </div>

            <div className="flex justify-center mb-8">
                <div className={`p-1 rounded-full flex gap-1 border ${isCenter ? "bg-white/5 border-white/10" : "bg-gray-100/50 border-gray-200"}`}>
                    <button onClick={() => setBillingCycle("Monthly")} className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${billingCycle === "Monthly" ? (isCenter ? "bg-white text-gray-900 shadow-sm" : "bg-[#FF6B00] text-white shadow-md shadow-orange-500/30") : (isCenter ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>
                        Monthly
                    </button>
                    <button onClick={() => setBillingCycle("Annually")} className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${billingCycle === "Annually" ? (isCenter ? "bg-white text-gray-900 shadow-sm" : "bg-[#FF6B00] text-white shadow-md shadow-orange-500/30") : (isCenter ? "text-white/60 hover:text-white" : "text-gray-500 hover:text-gray-900")}`}>
                        Annually
                    </button>
                </div>
            </div>

            <div className="mb-10 flex items-baseline justify-center gap-1">
                <span className={`text-6xl font-black tracking-tight ${isCenter ? "text-white" : "text-gray-900"}`}>${price}</span>
                <span className={`text-sm font-semibold ${isCenter ? "text-gray-400" : "text-gray-400"}`}>/ Month</span>
            </div>

            <div className="mt-auto">
                <Link href={user ? `/checkout/${plan.id}?duration=${billingCycle}` : `/signup?redirect=/checkout/${plan.id}&duration=${billingCycle}`}>
                    <Button className={`w-full py-6 rounded-xl font-bold text-base transition-all active:scale-95 mb-10 ${isCenter ? "bg-[#FF6B00] text-white hover:bg-[#E66000] shadow-lg shadow-orange-500/30 border-0" : "bg-white border-2 border-gray-200 text-gray-900 hover:border-[#FF6B00] hover:text-[#FF6B00]"}`}>
                        {plan.category === "PROFESSIONAL" ? "Start 14 days free trial" : "Get Started Now"}
                    </Button>
                </Link>

                <ul className="space-y-4 text-left">
                    {plan.baseIncludedText && (
                        <li className={`flex gap-3 items-center p-4 rounded-2xl border mb-4 ${isCenter ? "bg-white/5 border-white/10" : "bg-orange-50/50 border-orange-100"}`}>
                            <Sparkles className={`w-5 h-5 ${isCenter ? "text-orange-400" : "text-[#FF6B00]"}`} />
                            <span className={`text-sm font-bold uppercase tracking-wider ${isCenter ? "text-white" : "text-gray-900"}`}>
                                {plan.baseIncludedText}
                            </span>
                        </li>
                    )}
                    {plan.features.map((feature: PlanFeature, idx: number) => (
                        <li key={idx} className={`flex items-start gap-3 ${!feature.isActive && "opacity-40"}`}>
                            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCenter ? (feature.isActive ? "bg-orange-500/20" : "bg-white/5") : (feature.isActive ? "bg-orange-100" : "bg-gray-100")}`}>
                                {feature.isActive ? <Check className={`w-3.5 h-3.5 ${isCenter ? "text-orange-400" : "text-[#FF6B00]"}`} strokeWidth={3} /> : <Lock className={`w-3 h-3 ${isCenter ? "text-gray-500" : "text-gray-400"}`} />}
                            </div>
                            <span className={`text-[14px] font-medium leading-tight ${isCenter ? (feature.isActive ? "text-gray-300" : "text-gray-500") : (feature.isActive ? "text-gray-700" : "text-gray-400")}`}>
                                {feature.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-5">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left focus:outline-none">
                <span className="text-lg font-bold text-gray-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-[#FF6B00] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pt-4 text-gray-600 leading-relaxed font-medium">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
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
        <div className="flex flex-col min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-orange-200">
            
            {/* --- HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center bg-[#0a0a0a] overflow-hidden">
                {/* Mechanic Background Image placeholder */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gray-800 opacity-50 bg-[url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                </div>
                
                <div className="container mx-auto px-6 relative z-20 pt-20">
                    <div className="max-w-2xl">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight uppercase">
                                Stop Guessing <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D]">
                                    Start Billing
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed font-medium max-w-xl">
                                Empower your shop with AI-driven diagnostics, automated foreman assistance, and specialized vehicle repair intelligence. Reduce guesswork, save time, and grow your revenue.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <Link href={token ? "#pricing" : "/register"}>
                                    <Button className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#E66000] text-white px-10 py-7 rounded-xl text-lg font-bold transition-all shadow-xl shadow-orange-500/25 group">
                                        Try It On Your Next Vehicle
                                    </Button>
                                </Link>
                                <Button variant="outline" className="w-full sm:w-auto bg-white/10 border-2 border-white/20 text-white hover:bg-white/20 px-10 py-7 rounded-xl text-lg font-bold transition-all backdrop-blur-sm">
                                    Get a Demo
                                </Button>
                            </div>
                            <p className="mt-6 text-sm text-gray-400 font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" /> No credit card required. Cancel anytime.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID (Most Shops Don't Have a Diagnostic Problem) --- */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="mb-16">
                        <span className="text-[#FF6B00] font-bold text-sm tracking-widest uppercase block mb-3">The Real Problem</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight max-w-2xl">
                            Most Shops Don't Have a Diagnostic Problem
                        </h2>
                        <p className="text-lg text-gray-500 font-medium mt-6 max-w-2xl">
                            They have a workflow, data, and talent problem. SmartAutoTech brings everything into one unified platform so you can fix cars faster.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: MonitorPlay, title: "Unorganized Workflow", desc: "Techs jumping between 5 different screens just to find a wiring diagram.", color: "bg-blue-100 text-blue-600" },
                            { icon: BarChart3, title: "Disconnected Data", desc: "Service info that doesn't talk to scan tool data, leaving you to connect the dots.", color: "bg-orange-100 text-[#FF6B00]" },
                            { icon: Wrench, title: "Entry-Level Techs", desc: "Lacking the experience to know where to start when the scanner shows 15 codes.", color: "bg-purple-100 text-purple-600" },
                            { icon: Zap, title: "Lost Efficiency", desc: "Every minute spent researching is a minute not turning wrenches and billing hours.", color: "bg-rose-100 text-rose-600" },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-orange-100 transition-all border border-transparent hover:border-orange-100">
                                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURE 1: Foreman --- */}
            <section className="py-24 bg-[#FAFAFA] border-y border-gray-100 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-orange-200/50 rounded-[40px] blur-2xl z-0" />
                            <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl border border-white">
                                <Image src="/images/login.jpg" alt="Mechanic using tablet" width={800} height={600} className="w-full h-auto object-cover aspect-[4/3]" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl z-20 border border-gray-100 max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">AI Suggestion</p>
                                        <p className="text-xs text-gray-500 font-medium">Check wiring harness #4</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="text-[#FF6B00] font-bold text-sm tracking-widest uppercase block mb-3">Your Digital Partner</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                                A Foreman That Never Leaves the Bay
                            </h2>
                            <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed">
                                SmartAutoTech acts as a highly experienced foreman standing right next to your junior techs, guiding them through complex electrical and drivability issues step-by-step.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {["More Profit", "Better Techs", "Faster Fixes", "Less Comebacks"].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                                        </div>
                                        <span className="font-bold text-gray-900">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURE 2: Simple Tech --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                                Simple Tech Built for the Shop Floor.
                            </h2>
                            <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                                We didn't build this in a Silicon Valley boardroom. We built it in the bays, with greasy hands. The interface is massive, easy to tap with gloves on, and doesn't require a Ph.D. to understand.
                            </p>
                            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-xl text-base font-bold shadow-xl">
                                Explore Features
                            </Button>
                        </div>
                        <div className="w-full lg:w-1/2 relative">
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                                <Image src="/images/login.jpg" alt="Tech under car" width={800} height={600} className="w-full h-auto object-cover aspect-[4/3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- DASHBOARD SHOWCASE --- */}
            <section className="py-24 bg-[#0F172A] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0F172A] to-[#0F172A]"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
                        What This Means for Your Shop
                    </h2>
                    <p className="text-lg text-gray-400 font-medium mb-16 max-w-2xl mx-auto">
                        Everything you need to run a highly profitable diagnostic bay, all in one place.
                    </p>
                    
                    <div className="relative max-w-5xl mx-auto">
                        {/* Mockup Container */}
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-8 rounded-[40px] shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Mockup cards simulating the image */}
                                <div className="bg-white p-6 rounded-3xl text-left shadow-lg">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-blue-600"/></div>
                                        <div><p className="font-bold text-gray-900">Today's schedule</p><p className="text-xs text-gray-500">3 cars in bay</p></div>
                                    </div>
                                    <div className="space-y-3">
                                        {[1,2,3].map(i => <div key={i} className="h-12 w-full bg-gray-50 rounded-xl border border-gray-100 flex items-center px-4"><div className="w-2/3 h-3 bg-gray-200 rounded-full"></div></div>)}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-3xl text-left shadow-lg flex flex-col justify-center items-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <Check className="w-8 h-8 text-green-600" strokeWidth={4} />
                                    </div>
                                    <p className="font-black text-2xl text-gray-900">Issue Identified</p>
                                    <p className="text-gray-500 font-medium mt-2">Time saved: 45 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FEATURE 3: 10 Mins --- */}
            <section className="py-24 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                                <Image src="/images/login.jpg" alt="Happy mechanic" width={800} height={600} className="w-full h-auto object-cover aspect-square" />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <span className="text-[#FF6B00] font-bold text-sm tracking-widest uppercase block mb-3">ROI Calculator</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                                What Is 10 Mins per Car Worth?
                            </h2>
                            <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
                                If you save just 10 minutes on diagnostic research per car, and you see 5 cars a day... that's 50 minutes. At a $150/hr labor rate, that's $125 a day, $625 a week, or over $30,000 a year in recovered billable time.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-xl font-bold text-gray-900">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"><Zap className="w-6 h-6 text-[#FF6B00]" /></div>
                                    Speed = Profit
                                </div>
                                <div className="flex items-center gap-4 text-xl font-bold text-gray-900">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><BarChart3 className="w-6 h-6 text-blue-600" /></div>
                                    Bill More Hours
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-24 bg-[#FAFAFA]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#FF6B00] font-bold text-sm tracking-widest uppercase block mb-3">Reviews</span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                            One Avoided Comeback Pays for This
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { quote: "It’s like having a master diag tech in the pocket of every single one of my C-level technicians. We rarely send cars to the dealer anymore.", author: "Mike R.", role: "Shop Owner" },
                            { quote: "I was skeptical about AI, but this thing actually understands wiring diagrams better than I do. It found a parasitic draw we spent 4 hours on in about 10 minutes.", author: "David T.", role: "Lead Technician" },
                            { quote: "The ROI was immediate. The first time it gave us the pinpoint test for an obscure Volvo network code, it paid for the whole year.", author: "Sarah L.", role: "Service Manager" },
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative">
                                <Quote className="w-10 h-10 text-orange-100 absolute top-6 right-6" />
                                <div className="flex gap-1 mb-6">
                                    {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />)}
                                </div>
                                <p className="text-gray-700 font-medium mb-8 leading-relaxed text-lg">"{t.quote}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                         <Image src="/images/login.jpg" alt={t.author} width={48} height={48} className="object-cover h-full w-full" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t.author}</p>
                                        <p className="text-sm text-gray-500 font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PRICING SECTION --- */}
            <section id="pricing" className="py-24 lg:py-32 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-[#FF6B00] uppercase text-xs font-bold tracking-widest mb-4 block">
                            Transparent Pricing
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                            Simple, Transparent Pricing Built for Repair Shops
                        </h2>
                        <p className="text-lg text-gray-600 font-medium">
                            No hidden fees. No complicated tiers. Just powerful AI diagnostics that scale with your shop.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {plansLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#FF6B00] animate-spin" />
                                <p className="text-gray-500 font-medium">Fetching professional plans...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                                {plans.map((plan: any) => (
                                    <PricingCard key={plan.id} plan={plan} user={user} />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 bg-[#FAFAFA]">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <span className="text-[#FF6B00] font-bold text-sm tracking-widest uppercase block mb-3">FAQ</span>
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Everything You Need to Know Before You Subscribe
                        </h2>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <FaqItem question="Is there a setup fee or contract?" answer="No, we believe in earning your business every month. There are no setup fees and no long-term contracts unless you choose our annual plan for a discount." />
                        <FaqItem question="Does it integrate with my shop management system?" answer="Yes! We integrate with Tekmetric, Shopmonkey, Mitchell1, and many more. Your ROs sync seamlessly." />
                        <FaqItem question="Can my whole shop use one account?" answer="Each plan comes with a specific number of technician seats. You can easily add more seats as your shop grows." />
                        <FaqItem question="What if it doesn't help us fix cars faster?" answer="We offer a 14-day free trial. If you don't see immediate ROI, simply cancel before the trial ends and you won't be charged a dime." />
                    </div>
                </div>
            </section>

            {/* --- BOTTOM CTA --- */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-rose-50" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[40px] p-16 max-w-4xl mx-auto shadow-2xl shadow-orange-100/50">
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                            Try It on Your Next <br />Tough Vehicle
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto mb-10 text-lg font-medium">
                            Don't take our word for it. Put it to the test on that problem car sitting in bay 3 right now.
                        </p>
                        <Link href="/register">
                            <Button className="bg-[#1F2937] hover:bg-black text-white px-12 py-8 rounded-2xl text-xl font-bold shadow-xl transition-all hover:-translate-y-1">
                                 Start Your 14-Day Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-12 bg-white border-t border-gray-200">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <Image src={Logo.src} alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tight italic">
                            SmartAuto<span className="text-[#FF6B00]">Tech</span>
                        </span>
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                        © 2026 SmartAutoTech AI. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
