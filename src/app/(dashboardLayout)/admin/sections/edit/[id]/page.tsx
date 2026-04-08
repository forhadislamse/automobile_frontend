"use client";

import { useGetSectionByIdQuery, useUpdateSectionMutation } from "@/redux/api/guideApi";
import SectionForm, { SectionFormValues } from "../../_components/SectionForm";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export default function EditSectionPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: response, isLoading: isFetching } = useGetSectionByIdQuery(id, {
    skip: !id,
  });
  
  const [updateSection, { isLoading: isUpdating }] = useUpdateSectionMutation();

  const section = response?.data;

  const onSubmit = async (data: SectionFormValues) => {
    try {
      await updateSection({ id, ...data }).unwrap();
      toast.success("Section updated successfully");
      router.push("/admin/sections");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update section");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006064]"></div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="p-8 text-center text-red-500">
        Section not found
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Edit Section</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify legal details for the Texas Ethics Laws database
        </p>
      </div>

      <SectionForm 
        isEdit 
        initialData={{
          number: section.number,
          title: section.title,
          chapterId: section.chapterId,
          subChapter: section.subChapter || "",
          order: section.order,
          content: section.content,
          addedBy: section.addedBy || "",
          practiceNotes: section.practiceNotes || "",
          caseLaw: section.caseLaw || "",
          agOpinions: section.agOpinions || "",
          ethicsOpinions: section.ethicsOpinions || "",
          crossReferences: section.crossReferences || "",
        }}
        onSubmit={onSubmit} 
        isSubmitting={isUpdating} 
      />
    </div>
  );
}
