"use client";

import { OnboardingLayout } from "@/components/module/Onboarding/onboarding-layout";
import SubscriptionSection from "@/components/module/Onboarding/SubscriptionSection";
import { OnboardingProvider } from "@/src/app/context/onboarding-context";

export default function PaymentPage() {
  return (
    <OnboardingProvider>
      <OnboardingLayout currentStep={4}>
        <SubscriptionSection />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}
