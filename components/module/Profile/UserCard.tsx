/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetProfileQuery } from "@/redux/api/authApi";
import { SquarePen, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ShopOwnerCardSkeleton from "../ShopOwner/Profile/ShopOwnerCardSkeleton";

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
      <div className="flex justify-start">
        {hasImage ? (
          <Image
            src={profileImage}
            alt="user"
            width={500}
            height={500}
            className="rounded-full w-32 h-32 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-500" />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-start gap-4">
        <Link href="/admin/profile/edit">
          <Button
            variant="secondary"
            className="flex items-center justify-center"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>

        <Link href="/admin/profile/changepassword">
          <Button
            variant="secondary"
            className="flex items-center justify-center"
          >
            <SquarePen className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </Link>
      </div>

      <div className="border rounded-2xl p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600">Admin Name</h3>
            <p className="text-gray-800">{me?.fullName || "-"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600">Email Address</h3>
            <p className="text-gray-800">{me?.email || "-"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShopOwnerCard;

