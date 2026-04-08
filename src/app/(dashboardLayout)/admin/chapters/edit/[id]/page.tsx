"use client";

import { useGetChapterByIdQuery, useUpdateChapterMutation } from "@/redux/api/guideApi";
import ChapterForm, { ChapterFormValues } from "../../_components/ChapterForm";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";

export default function EditChapterPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: response, isLoading: isFetching } = useGetChapterByIdQuery(id, {
    skip: !id,
  });
  
  const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();

  const chapter = response;

  const onSubmit = async (data: ChapterFormValues) => {
    try {
      await updateChapter({ id, ...data }).unwrap();
      toast.success("Chapter updated successfully");
      router.push("/admin/chapters");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update chapter");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006064]"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="p-8 text-center text-red-500">
        Chapter not found
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Edit Chapter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify legal details for the Texas Ethics Laws database
        </p>
      </div>

      <ChapterForm 
        isEdit 
        initialData={{
          number: chapter.number,
          title: chapter.title,
          order: chapter.order,
          code: chapter.code || "",
          titleLevel: chapter.titleLevel || "",
          subtitleLevel: chapter.subtitleLevel || "",
        }}
        onSubmit={onSubmit} 
        isSubmitting={isUpdating} 
      />
    </div>
  );
}
