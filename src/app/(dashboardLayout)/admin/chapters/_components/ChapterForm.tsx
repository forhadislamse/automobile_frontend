 "use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const getChapterSchema = (isEdit: boolean) => z.object({
  number: isEdit ? z.string().optional() : z.string().min(1, { message: "Chapter No. is required" }),
  order: isEdit ? z.union([z.number(), z.string().length(0)]).optional() : z.number().min(1, { message: "Display order must be a valid number" }),
  title: isEdit ? z.string().optional() : z.string().min(1, { message: "Chapter Title is required" }),
  code: z.string().optional(),
  titleLevel: z.string().optional(),
  subtitleLevel: z.string().optional(),
});

export type ChapterFormValues = any;

interface ChapterFormProps {
  initialData?: any;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

export default function ChapterForm({
  initialData,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
}: ChapterFormProps) {
  const router = useRouter();

  const form = useForm<any>({
    resolver: zodResolver(getChapterSchema(isEdit)),
    defaultValues: initialData || {
      number: "",
      order: 1,
      title: "",
      code: "",
      titleLevel: "",
      subtitleLevel: "",
    },
  });

  return (
    <Card className="border-gray-100 shadow-sm mt-6">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-900">Chapter No.</FormLabel>
                    <FormControl>
                      <Input placeholder="Write chapter no." {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-900">Display order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                        className="bg-white" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-900">Chapter Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write chapter name" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-900">Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. GOVERNMENT CODE" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-900">Title Level (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Title 5. Open Government; Ethics" {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subtitleLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-900">Subtitle Level (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Subtitle A. Open Government" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-4 pt-4">
              {isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/chapters")}
                  className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700 px-8 rounded-full"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#006064] hover:bg-[#00838F] text-white px-8 rounded-full"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Chapter"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
