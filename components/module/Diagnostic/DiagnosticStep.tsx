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

  // Specialized State: Confirm Switch / Invalid Input (Minimalist Gemini Style)
  if (data.status === 'confirm_switch' || data.status === 'INVALID_INPUT' || data.accepted === false) {
    const isError = data.status === 'INVALID_INPUT' || data.accepted === false;
    return (
      <div className={cn(
        "py-4 border-l-4 pl-6 space-y-3 my-2",
        isError ? "border-rose-500 bg-rose-50/30" : "border-amber-400 bg-amber-50/30"
      )}>
        <p className="text-[16px] text-slate-800 font-medium leading-relaxed">
            {data.message || data.reason}
        </p>
        {isLatest && data.status === 'confirm_switch' && (
          <div className="flex gap-3 pt-2">
            <Button onClick={() => onOptionSelect("Switch")} className="bg-slate-900 text-white rounded-full px-6 h-9 text-sm font-medium">Yes, Switch</Button>
            <Button onClick={() => onOptionSelect("Continue")} variant="ghost" className="text-slate-500 rounded-full px-6 h-9 text-sm font-medium">Continue</Button>
          </div>
        )}
      </div>
    );
  }

  const isConclusion = data.state_action === "final_conclusion";

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Main Text Content - Pure Gemini Style */}
      <div className="space-y-4">
        {data.step_title && (
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
            {data.step_title}
          </h2>
        )}
        
        <div className="text-[16px] text-slate-700 leading-relaxed font-normal prose prose-slate max-w-none">
          <ReactMarkdown>{data.current_assessment || data.full_text_response || ""}</ReactMarkdown>
        </div>

        {data.instruction && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[18px] font-medium text-slate-900 leading-relaxed italic">
              {data.instruction}
            </p>
            {data.what_to_check && (
              <p className="text-sm text-slate-400 mt-2 font-medium">
                Tip: {data.what_to_check}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Conclusion Style */}
      {isConclusion && (
        <div className="py-6 border-t-2 border-emerald-500 mt-8">
            <h4 className="text-lg font-semibold text-emerald-700">Diagnosis Confirmed</h4>
            <p className="text-[16px] text-slate-600 mt-1">The system has finalized the assessment.</p>
        </div>
      )}

      {/* Response Options - Clean Gemini Pill Buttons */}
      {isLatest && !isConclusion && data.response_options && data.response_options.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-50">
          {data.response_options.map((option: string) => (
            <Button
              key={option}
              onClick={() => onOptionSelect(option)}
              variant="outline"
              className={cn(
                "h-auto py-2.5 px-6 rounded-full border-slate-200 font-medium text-[14px] transition-all duration-300",
                "hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-600 bg-white shadow-sm"
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
