"use client";

import { useCreateSectionMutation } from "@/redux/api/guideApi";
import SectionForm, { SectionFormValues } from "../_components/SectionForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateSectionPage() {
  const [createSection, { isLoading }] = useCreateSectionMutation();
  const router = useRouter();

  const onSubmit = async (data: SectionFormValues) => {
    try {
      await createSection(data).unwrap();
      toast.success("Section created successfully");
      router.push("/admin/sections");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create section");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Add New Section</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure a new legislative section for the Texas Ethics legal framework.
        </p>
      </div>

      <SectionForm onSubmit={onSubmit} isSubmitting={isLoading} />
    </div>
  );
}
