"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1_ShopSetup from "./Step1_ShopSetup";
import Step2_PlanSelection from "./Step2_PlanSelection";
import Step3_Payment from "./Step3_Payment";
import Image from "next/image";
import { useGetAllPlansQuery } from "@/redux/api/planApi";

const steps = [
  { id: 1, name: "Shop Setup" },
  { id: 2, name: "Plan Selection" },
  { id: 3, name: "Payment" },
];

export default function ShopOnboarding() {
  const { data: plansData, isLoading: plansLoading } = useGetAllPlansQuery(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<any>({});

  const nextStep = (data?: any) => {
    if (data) setOnboardingData((prev: any) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header / Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Image src="/logo2.png" alt="Logo" width={150} height={50} className="object-contain" />
        <h1 className="text-3xl font-bold text-[#0a1628] mt-6">
          {currentStep === 1 ? "Get Started" : "Shop Owner On-boarding"}
        </h1>
      </div>

      {/* Steper Indicator */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-12 relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-[#0a1628] -z-10 -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                currentStep >= step.id ? "bg-[#0a1628] text-white" : "bg-white border-2 border-gray-200 text-gray-400"
              }`}
            >
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? "text-[#0a1628]" : "text-gray-400"}`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content Area with Animation */}
      <div className="w-full max-w-6xl relative overflow-hidden min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            {currentStep === 1 && <Step1_ShopSetup onNext={nextStep} data={onboardingData} />}
            {currentStep === 2 && (
              plansLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a1628]"></div>
                  <p className="mt-4 text-gray-500 font-medium italic">Loading plans...</p>
                </div>
              ) : (
                <Step2_PlanSelection 
                  plans={plansData?.data || []} 
                  onNext={nextStep} 
                  onBack={prevStep} 
                />
              )
            )}
            {currentStep === 3 && <Step3_Payment onPrev={prevStep} data={onboardingData} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
