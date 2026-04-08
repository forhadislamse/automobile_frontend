"use client";

import { useCreateChapterMutation } from "@/redux/api/guideApi";
import ChapterForm, { ChapterFormValues } from "../_components/ChapterForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateChapterPage() {
  const [createChapter, { isLoading }] = useCreateChapterMutation();
  const router = useRouter();

  const onSubmit = async (data: ChapterFormValues) => {
    try {
      await createChapter(data).unwrap();
      toast.success("Chapter created successfully");
      router.push("/admin/chapters");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create chapter");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Add New Chapter</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new organizational chapter within the Texas Ethics Laws database. Ensure all legal citations are accurate.
        </p>
      </div>

      <ChapterForm onSubmit={onSubmit} isSubmitting={isLoading} />
    </div>
  );
}
