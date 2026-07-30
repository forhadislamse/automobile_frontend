/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetProfileQuery } from "@/redux/api/authApi";
import { SquarePen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShopOwnerCardSkeleton from "./ShopOwnerCardSkeleton";

const ShopOwnerCard = () => {
  const { data: getMeData, isLoading } = useGetProfileQuery({}) as any;

  const me = getMeData?.data;

  const profileImage = me?.profileImage;
  const hasImage = profileImage && profileImage.trim() !== "";

  if (isLoading) {
    return <ShopOwnerCardSkeleton />;
  }

  return (
    <Card className="p-8 space-y-6 mx-auto">
      {/* User Image */}
      <div className="flex justify-start">
        {hasImage ? (
          <Image
            src={profileImage}
            alt="user"
            width={120}
            height={120}
            className="rounded-full w-32 h-32 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-start gap-4">
        <Link href="/shop-owner/dashboard/profile/edit">
          <Button
            variant="secondary"
            className="flex items-center justify-center"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>

        <Link href="/shop-owner/dashboard/profile/changepassword">
          <Button
            variant="secondary"
            className="flex items-center justify-center"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </Link>
      </div>

      {/* Personal Info */}
      <div className="border rounded-2xl p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              Shop Owner Name
            </h3>
            <p className="text-gray-800">{me?.fullName || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
            <p className="text-gray-800">{me?.email || "-"}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">Shop Name</h3>
            <p className="text-gray-800">{me?.shopName || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Shop Address</h3>
            <p className="text-gray-800">{me?.shopAddress || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
            <p className="text-gray-800">{me?.phone || "-"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShopOwnerCard;
