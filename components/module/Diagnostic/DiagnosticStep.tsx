"use client";

import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagnosticData {
  vehicle: string;
  concern: string;
  system_focus: string;
  current_assessment: string;
  step_number: number;
  step_title: string;
  instruction: string;
  what_to_check: string;
  response_options: string[];
  state_action: string;
  full_text_response: string;
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
    // Fallback if content is not JSON (legacy support)
    return (
      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  }

  const isConclusion = data.state_action === "final_conclusion";

  return (
    <div className="space-y-4 w-full">
      {/* Main Narrative - AI's reasoning */}
      <div className="text-sm leading-relaxed prose prose-sm max-w-none text-gray-700">
        <ReactMarkdown>{data.full_text_response}</ReactMarkdown>
      </div>

      {/* Action Card - The specific instruction */}
      {!isConclusion && (
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/50 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step {data.step_number}: {data.step_title}
              </h4>
              <p className="text-sm font-semibold text-blue-900 leading-snug">
                {data.instruction}
              </p>
            </div>
          </div>

          <div className="mt-3 ml-11 border-t border-blue-100 pt-3">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-700">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>What to check:</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">{data.what_to_check}</p>
          </div>
        </Card>
      )}

      {/* Final Conclusion Card */}
      {isConclusion && (
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/50 p-4 shadow-md border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Diagnostic Confirmed
              </h4>
              <p className="text-sm font-bold text-emerald-900 mt-1">
                Root cause identified through testing.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Response Options - Interactive Buttons */}
      {isLatest && !isConclusion && data.response_options.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 pt-2"
        >
          {data.response_options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onOptionSelect(option)}
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all rounded-full px-4 group"
            >
              <span>{option}</span>
              <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default DiagnosticStep;
