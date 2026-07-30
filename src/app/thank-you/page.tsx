"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || "0";
  const orderId = searchParams.get("orderId") || "UNKNOWN";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Rebrandly Base Script & Conversion Tracking */}
      <Script 
        src="https://cdn.rebrandly.com/analytics/sdk/v1/rbly.min.js" 
        data-api-key="6bfffa9350fe4ffabb8998c47acb1c26"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore - Rebrandly adds rbly to window
          if (typeof window !== 'undefined' && window.rbly) {
            // @ts-ignore
            window.rbly.convert('purchase', parseFloat(amount), 'USD', { orderId });
            console.log("Rebrandly Conversion Fired:", { amount, orderId });
          }
        }}
      />
      
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>
          <p className="text-gray-500">
            Your subscription has been successfully processed. Welcome to SmartAutoTech!
          </p>
        </div>

        <div className="pt-4">
          <Link href="/shop-owner/dashboard">
            <Button className="w-full h-12 text-lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}

