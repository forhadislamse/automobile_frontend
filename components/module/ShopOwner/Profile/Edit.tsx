/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetProfileQuery, useUpdateUserMutation } from "@/redux/api/authApi";

import Loading from "@/components/shared/Loading";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ShopOwnerCardSkeleton from "./ShopOwnerCardSkeleton";

interface FormValues {
  fullName: string;
  email: string;
  shopName: string;
  shopAddress: string;
  phone: string;
}

export default function ShopOwnerProfileCard() {
  const router = useRouter();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: getMeData, isLoading } = useGetProfileQuery({}) as any;
  const me = getMeData?.data;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (me) {
      reset({
        fullName: me.fullName ?? "",
        shopName: me.shopName ?? "",
        shopAddress: me.shopAddress ?? "",
        phone: me.phone ?? "",
      });
      if (me.profileImage) {
        setImagePreview(me.profileImage);
      }
    }
  }, [me, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("data", JSON.stringify(data));

      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      // window.location.reload();
      router.push("/shop-owner/dashboard/profile");
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (isLoading) return <ShopOwnerCardSkeleton />;

  return (
    <Card className="max-w-2xl border-0 mx-auto p-6">
      <div className="flex gap-6 items-center space-y-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-300" />
          )}
        </div>

        <label className="cursor-pointer bg-[#ebeaf1] text-[#4F5655] font-bold px-4 py-2 rounded text-sm hover:bg-gray-300">
          Upload new Image
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Form */}
      <CardContent className="mt-6 border p-6 rounded-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Full Name
            </label>
            <Input
              {...register("fullName")}
              className="py-6"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Shop Name
            </label>
            <Input
              {...register("shopName")}
              className="py-6"
              placeholder="Enter shop name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Shop Address
            </label>
            <Input
              {...register("shopAddress")}
              className="py-6"
              placeholder="Enter shop address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              {...register("phone")}
              className="py-6"
              placeholder="Enter phone number"
            />
          </div>

          <div className="flex justify-start gap-2 mt-5">
            <Link href="/shop-owner/dashboard/profile">
              <Button className="py-4" type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button className="py-4" type="submit" disabled={isUpdating}>
              {isUpdating ? <Loading /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
