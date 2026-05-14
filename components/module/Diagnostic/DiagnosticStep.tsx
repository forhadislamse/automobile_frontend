"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiagnosticData {
  vehicle?: string;
  concern?: string;
  system_focus?: string;
  current_assessment?: string;
  step_number?: number;
  step_title?: string;
  instruction?: string;
  what_to_check?: string;
  response_options?: string[];
  state_action?: string;
  full_text_response?: string;
  status?: string;
  message?: string;
  reason?: string;
  accepted?: boolean;
  expected_response_options?: string[];
}

interface DiagnosticStepProps {
  content: string;
  onOptionSelect: (option: string) => void;
  isLatest: boolean;
}

const DiagnosticStep: React.FC<DiagnosticStepProps> = ({ content, onOptionSelect, isLatest }) => {
  let data: DiagnosticData;

  try {
    data = JSON.parse(content);
  } catch (e) {
    return (
      <div className="text-[16px] leading-relaxed text-slate-700 font-normal">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  // Specialized State: Gemini Style Alerts (Confirm Switch / Plan Locked / Invalid Input)
  if (data.status === 'confirm_switch' || data.status === 'PLAN_LOCKED' || data.status === 'INVALID_INPUT' || data.accepted === false) {
    const isError = data.status === 'INVALID_INPUT' || data.accepted === false;
    const isLocked = data.status === 'PLAN_LOCKED';
    
    return (
      <div className={cn(
        "py-5 px-6 border-l-4 rounded-r-2xl space-y-3 my-4",
        isLocked ? "border-slate-900 bg-slate-50" : 
        isError ? "border-rose-500 bg-rose-50/50" : "border-amber-400 bg-amber-50/50"
      )}>
        <p className={cn(
            "text-[15px] leading-relaxed",
            isLocked ? "text-slate-900 font-semibold" : "text-slate-800 font-medium"
        )}>
            {data.message || data.reason}
        </p>
        
        {isLatest && data.status === 'confirm_switch' && (
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onOptionSelect("Switch")} className="bg-slate-900 text-white rounded-full px-6 h-9 text-sm font-medium">Yes, Switch</Button>
            <Button onClick={() => onOptionSelect("Continue")} variant="ghost" className="text-slate-500 rounded-full px-6 h-9 text-sm font-medium">Continue</Button>
          </div>
        )}

        {isLocked && (
            <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Contact Shop Admin for Upgrade
            </div>
        )}
      </div>
    );
  }

  const isConclusion = data.state_action === "final_conclusion";

  return (
    <div className="w-full space-y-6">
      {/* Main Content Area */}
      <div className="space-y-5">
        {data.step_title && (
          <h2 className="text-xl font-medium text-slate-900 tracking-tight">
            {data.step_title}
          </h2>
        )}
        
        <div className="text-[16px] text-slate-700 leading-relaxed font-normal prose prose-slate max-w-none">
          <ReactMarkdown>{data.current_assessment || data.full_text_response || ""}</ReactMarkdown>
        </div>

        {/* Integrated Instructions */}
        {data.instruction && (
          <div className="mt-8 space-y-3">
            <p className="text-[18px] font-medium text-slate-900 leading-snug">
              {data.instruction}
            </p>
            {data.what_to_check && (
              <p className="text-sm text-slate-400 font-medium tracking-wide">
                HELPFUL TIP: {data.what_to_check}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Conclusion Style */}
      {isConclusion && (
        <div className="pt-8 border-t border-slate-100 mt-8">
            <div className="inline-flex items-center px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[12px] font-bold uppercase tracking-widest mb-3">
                Final Diagnosis
            </div>
            <p className="text-[16px] text-slate-600 leading-relaxed">The assessment has been completed based on the provided technical data.</p>
        </div>
      )}

      {/* Response Options - Minimalist Gemini Buttons */}
      {isLatest && !isConclusion && data.response_options && data.response_options.length > 0 && (
        <div className="flex flex-wrap gap-2.5 pt-8">
          {data.response_options.map((option: string) => (
            <Button
              key={option}
              onClick={() => onOptionSelect(option)}
              variant="outline"
              className={cn(
                "h-auto py-2.5 px-6 rounded-full border-slate-200 font-medium text-[14px] transition-all duration-200",
                "hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-600 bg-white"
              )}
            >
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosticStep;
