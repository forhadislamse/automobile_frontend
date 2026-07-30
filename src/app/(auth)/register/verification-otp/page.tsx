"use client";

import VerificationOtpPage from "@/components/module/Auth/VerificationOtp";
import { OnboardingLayout } from "@/components/module/Onboarding/onboarding-layout";
import { OnboardingProvider } from "@/src/app/context/onboarding-context";

export default function VerificationOtp() {
  return (
    <OnboardingProvider>
      <OnboardingLayout currentStep={2}>
        <VerificationOtpPage />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}
