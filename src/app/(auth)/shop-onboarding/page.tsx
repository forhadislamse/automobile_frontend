import ShopOnboarding from "@/components/module/Auth/ShopOnboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Owner Onboarding | SmartAutoTech AI",
  description: "Set up your shop and choose a subscription plan to get started.",
};

export default function ShopOnboardingPage() {
  return <ShopOnboarding />;
}

