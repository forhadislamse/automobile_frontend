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
      <div className="text-[15px] leading-relaxed text-slate-600 font-medium">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  // Specialized State: Confirm Switch
  if (data.status === 'confirm_switch') {
    return (
      <div className="py-4 border-l-2 border-amber-400 pl-6 space-y-3">
        <span className="font-bold uppercase tracking-widest text-[10px] text-amber-600">Action Required</span>
        <p className="text-[15px] text-slate-700 font-medium leading-relaxed">{data.message}</p>
        {isLatest && (
          <div className="flex gap-2 pt-1">
            <Button 
                onClick={() => onOptionSelect("Switch")}
                className="bg-slate-900 text-white rounded-full px-6 h-9 text-sm font-semibold hover:bg-slate-800"
            >
                Yes, Switch
            </Button>
            <Button 
                onClick={() => onOptionSelect("Continue")}
                variant="ghost"
                className="text-slate-500 rounded-full px-6 h-9 text-sm font-semibold hover:bg-slate-100"
            >
                Continue
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Specialized State: Invalid Input
  if (data.status === 'INVALID_INPUT' || data.accepted === false) {
    return (
        <div className="py-4 border-l-2 border-rose-400 pl-6 space-y-2">
          <span className="font-bold uppercase tracking-widest text-[10px] text-rose-500">Validation Error</span>
          <div className="space-y-1">
            <h4 className="font-semibold text-slate-900 text-base">{data.reason || "Invalid Selection"}</h4>
            <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{data.message}</p>
          </div>
          {data.expected_response_options && (
            <div className="flex flex-wrap gap-2 pt-2">
                {data.expected_response_options.map((opt: string) => (
                    <span key={opt} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 rounded-full uppercase tracking-wider">
                        {opt}
                    </span>
                ))}
            </div>
          )}
        </div>
    );
  }

  const isConclusion = data.state_action === "final_conclusion";

  return (
    <div className="space-y-6 py-2 w-full">
      {/* Header Info - Clean Text */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>Vehicle: <span className="text-slate-500">{data.vehicle || "N/A"}</span></span>
        <span>Concern: <span className="text-slate-500">{data.concern || "N/A"}</span></span>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 leading-tight tracking-tight">
                {data.step_title || "Technical Assessment"}
            </h3>
            <div className="text-[15px] text-slate-600 leading-relaxed max-w-3xl font-medium">
                <ReactMarkdown>{data.current_assessment || data.full_text_response || ""}</ReactMarkdown>
            </div>
        </div>
      </div>

      {/* Instruction Section */}
      {!isConclusion && data.instruction && (
        <div className="py-6 border-y border-slate-50 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500">Required Action</span>
            <p className="text-xl font-medium text-slate-900 leading-snug tracking-tight">
                {data.instruction}
            </p>
            {data.what_to_check && (
                <p className="text-sm font-medium italic text-slate-400">{data.what_to_check}</p>
            )}
        </div>
      )}

      {/* Conclusion Style */}
      {isConclusion && (
        <div className="py-8 border-t-2 border-emerald-400 space-y-2">
            <h4 className="text-xl font-semibold tracking-tight text-emerald-600">Diagnosis Confirmed</h4>
            <p className="text-[16px] text-slate-600 font-medium leading-relaxed max-w-2xl">The root cause has been isolated and verified through technical testing.</p>
        </div>
      )}

      {/* Response Options */}
      {isLatest && !isConclusion && data.response_options && data.response_options.length > 0 && (
        <div className="space-y-4 pt-4">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Test Results</p>
            <div className="flex flex-wrap gap-2">
            {data.response_options.map((option: string) => (
                <Button
                key={option}
                onClick={() => onOptionSelect(option)}
                variant="outline"
                className={cn(
                    "h-auto py-3 px-8 rounded-full border-slate-200 font-semibold text-[14px] transition-all",
                    "hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-600"
                )}
                >
                {option}
                </Button>
            ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticStep;
