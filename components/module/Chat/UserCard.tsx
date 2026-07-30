/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetProfileQuery } from "@/redux/api/authApi";
import { SquarePen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShopOwnerCardSkeleton from "../ShopOwner/Profile/ShopOwnerCardSkeleton";

const TechnicianCard = () => {
  const { data: getMeData, isLoading } = useGetProfileQuery({}) as any;

  const me = getMeData?.data;

  const profileImage = me?.profileImage;
  const hasImage = profileImage && profileImage.trim() !== "";

  if (isLoading) {
    return <ShopOwnerCardSkeleton />;
  }

  return (
    <Card className="w-full max-w-lg mx-auto border-none bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-6">
        {hasImage ? (
          <Image
            src={profileImage}
            alt="user"
            width={80}
            height={80}
            className="rounded-full w-20 h-20 object-cover "
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {me?.fullName || "Unnamed"}
          </h2>
          <p className="text-sm text-gray-500 truncate">{me?.email || "-"}</p>
        </div>

        <Link href="/chat/profile/edit">
          <Button
            size="sm"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <SquarePen className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Info Section */}
      <div className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Full Name</p>
            <p className="text-sm font-medium text-gray-900">
              {me?.fullName || "-"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">
              {me?.email || "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechnicianCard;
