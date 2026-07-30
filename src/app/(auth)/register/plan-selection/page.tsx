"use client";

import { OnboardingLayout } from "@/components/module/Onboarding/onboarding-layout";
import PlanSelection from "@/components/module/Onboarding/PlanSelection";
import { OnboardingProvider } from "@/src/app/context/onboarding-context";

export default function PlanSelectionPage() {
  return (
    <OnboardingProvider>
      <OnboardingLayout currentStep={3}>
        <PlanSelection />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}

