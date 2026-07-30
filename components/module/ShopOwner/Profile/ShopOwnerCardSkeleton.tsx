"use client";

import { Card } from "@/components/ui/card";

const ShopOwnerCardSkeleton = () => {
  return (
    <Card className="p-8 space-y-6 mx-auto animate-pulse">
      {/* Image skeleton */}
      <div className="flex justify-start">
        <div className="w-32 h-32 rounded-full bg-gray-200" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-10 w-full sm:w-40 bg-gray-200 rounded-md" />
        <div className="h-10 w-full sm:w-44 bg-gray-200 rounded-md" />
      </div>

      {/* Personal info skeleton */}
      <div className="border rounded-2xl p-6 space-y-6 bg-gray-50">
        <div className="h-5 w-40 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-44 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="h-px bg-gray-200" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShopOwnerCardSkeleton;
