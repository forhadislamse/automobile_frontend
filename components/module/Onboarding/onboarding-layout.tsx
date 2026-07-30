import Image from "next/image";
import { StepIndicator } from "./onboarding-step-indicator";

interface OnboardingLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

export function OnboardingLayout({
  currentStep,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/r_logo.png"
            alt="SmartAuto"
            width={300}
            height={300}
            className="object-contain w-38 h-38"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Shop Owner On-boarding
        </h1>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
