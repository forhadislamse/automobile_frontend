import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Shop Setup" },
    { number: 2, label: "Verification" },
    { number: 3, label: "Plan Selection" },
    { number: 4, label: "Payment" },
  ];

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-2">
            {step.number < currentStep ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#5177bf] to-[#12377d] flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            ) : step.number === currentStep ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#5177bf] to-[#12377d] flex items-center justify-center">
                <span className="text-white font-semibold">{step.number}</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 font-semibold">
                  {step.number}
                </span>
              </div>
            )}
            <span className="text-sm font-medium text-[#111827]">
              {step.label}
            </span>
          </div>

          {/* Connector line — sits between circles, vertically aligned to circle center */}
          {index < steps.length - 1 && (
            <div className="mb-6 mx-3 w-16 h-0.5 flex-shrink-0">
              <div
                className={`w-full h-full ${
                  step.number < currentStep
                    ? "bg-gradient-to-r from-[#12377d] to-[#5177bf]"
                    : "bg-gray-300"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
