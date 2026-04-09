"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

interface Step2Props {
  plans: any[];
  onNext: (data: any) => void;
  onBack: () => void;
}

const PlanCard = ({ plan, onSelect }: { plan: any, onSelect: (plan: any, cycle: string) => void }) => {
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Annually">("Monthly");
  
  const priceObj = plan.prices.find((p: any) => p.duration === billingCycle);
  const price = priceObj ? priceObj.price : 0;

  return (
    <div 
      className={`p-6 md:p-8 rounded-3xl border-2 transition-all flex flex-col h-full bg-white shadow-sm hover:shadow-md ${
        plan.category === "PROFESSIONAL" ? "border-blue-500 ring-4 ring-blue-500/5" : "border-gray-100"
      }`}
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#0a1628] mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{plan.description}</p>
      </div>

      {/* Individual Toggle */}
      <div className="flex mb-6">
        <div className="bg-gray-100 p-1 rounded-full flex gap-1 border border-gray-200">
          <button 
            type="button"
            onClick={() => setBillingCycle("Monthly")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              billingCycle === "Monthly" ? "bg-[#0a1628] text-white shadow-sm" : "text-gray-500"
            }`}
          >
            Monthly
          </button>
          <button 
             type="button"
            onClick={() => setBillingCycle("Annually")}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${
              billingCycle === "Annually" ? "bg-[#0a1628] text-white shadow-sm" : "text-gray-500"
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-5xl font-black text-[#0a1628]">${price}</span>
        <span className="text-sm font-bold text-gray-400">/mo</span>
      </div>

      <button 
        type="button"
        onClick={() => onSelect(plan, billingCycle)}
        className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all active:scale-95 ${
          plan.category === "PROFESSIONAL"
          ? "bg-[#0a1628] text-white hover:bg-[#1a2d4b] shadow-lg shadow-blue-900/20"
          : "bg-white border-2 border-gray-200 text-[#0a1628] hover:border-[#0a1628]"
        }`}
      >
        {plan.category === "PROFESSIONAL" ? "Start 14-days free trial" : "Get Started Now"}
      </button>

      <ul className="space-y-4 flex-grow">
        {plan.features.map((feature: string, idx: number) => (
          <li key={idx} className="flex gap-3">
            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
              <Check className="w-3 h-3 text-blue-600" strokeWidth={3} />
            </div>
            <span className="text-sm font-bold text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Step2_PlanSelection: React.FC<Step2Props> = ({ plans, onNext, onBack }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[#0a1628] mb-3">Choose Your Plan</h2>
        <p className="text-gray-500 font-medium">Select the best solution for your business diagnostics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
        {plans?.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onSelect={(selectedPlan, billingCycle) => onNext({ selectedPlan, billingCycle })} 
          />
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onBack}
          className="text-sm font-bold text-gray-400 hover:text-[#0a1628] transition-colors flex items-center gap-2"
        >
          ← Go back to shop setup
        </button>
      </div>
    </div>
  );
};

export default Step2_PlanSelection;
