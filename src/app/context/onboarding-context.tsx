/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface OnboardingData {
  // Step 1
  ownerName: string;
  shopName: string;
  shopAddress: string;
  phoneNumber: string;
  email: string;
  password: string;
  acceptTerms: boolean;

  // Step 2
  selectedPlan: "basic" | "professional" | "european";
  billingCycle: "monthly" | "annually";

  // Step 3
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  postalCode: string;
  state: string;
}

const defaultData: OnboardingData = {
  ownerName: "",
  shopName: "",
  shopAddress: "",
  phoneNumber: "",
  email: "",
  password: "",
  acceptTerms: false,
  selectedPlan: "basic",
  billingCycle: "monthly",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
  cardholderName: "",
  country: "United States",
  addressLine1: "",
  addressLine2: "",
  suburb: "",
  city: "",
  postalCode: "",
  state: "",
};

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
  isLoaded: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_data");
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved onboarding data:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("onboarding_data", JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem("onboarding_data");
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData, isLoaded }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
