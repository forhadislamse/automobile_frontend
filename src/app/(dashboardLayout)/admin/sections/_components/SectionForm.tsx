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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useGetAllChaptersQuery } from "@/redux/api/guideApi";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const getSectionSchema = (isEdit: boolean) => z.object({
  number: isEdit ? z.string().optional() : z.string().min(1, { message: "Section Number is required" }),
  title: isEdit ? z.string().optional() : z.string().min(1, { message: "Section Title is required" }),
  chapterId: isEdit ? z.string().optional() : z.string().min(1, { message: "Chapter is required" }),
  order: isEdit ? z.union([z.number(), z.string().length(0)]).optional() : z.number().min(1, { message: "Display order must be a valid number" }),
  subChapter: z.string().optional(),
  content: isEdit ? z.string().optional() : z.string().min(1, { message: "Main content is required" }),
  addedBy: z.string().optional(),
  practiceNotes: z.string().optional(),
  caseLaw: z.string().optional(),
  agOpinions: z.string().optional(),
  ethicsOpinions: z.string().optional(),
  crossReferences: z.string().optional(),
});

export type SectionFormValues = any;

interface SectionFormProps {
  initialData?: any;
  isEdit?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

export default function SectionForm({
  initialData,
  isEdit = false,
  isSubmitting = false,
  onSubmit,
}: SectionFormProps) {
  const router = useRouter();

  const { data: chaptersData } = useGetAllChaptersQuery({});
  const chapters = chaptersData?.data || [];

  const form = useForm<any>({
    resolver: zodResolver(getSectionSchema(isEdit)),
    defaultValues: initialData || {
      number: "",
      title: "",
      chapterId: "",
      subChapter: "",
      order: 1,
      content: "",
      addedBy: "",
      practiceNotes: "",
      caseLaw: "",
      agOpinions: "",
      ethicsOpinions: "",
      crossReferences: "",
    },
  });

  const handleFormSubmit = (data: SectionFormValues) => {
    const htmlFields = [
      data.content,
      data.addedBy,
      data.practiceNotes,
      data.caseLaw,
      data.agOpinions,
      data.ethicsOpinions,
      data.crossReferences
    ];

    const internalRefs: any[] = [];
    const externalRefs: any[] = [];

    if (typeof window !== "undefined") {
      const parser = new window.DOMParser();
      htmlFields.forEach(html => {
        if (!html) return;
        const doc = parser.parseFromString(html, "text/html");
        const links = doc.querySelectorAll("a");
        links.forEach(link => {
          const type = link.getAttribute("data-ref-type");
          if (type === "internal") {
            internalRefs.push({
              linkText: link.textContent || "",
              popupTitle: link.getAttribute("data-popup-title") || "",
              popupExcerpt: link.getAttribute("data-popup-excerpt") || "",
            });
          } else if (type === "external") {
            externalRefs.push({
              linkText: link.textContent || "",
              url: link.getAttribute("href") || "",
            });
          }
        });
      });
    }

    // Deduplicate refs
    const uniqueInternal = Array.from(new Set(internalRefs.map(r => JSON.stringify(r)))).map(s => JSON.parse(s));
    const uniqueExternal = Array.from(new Set(externalRefs.map(r => JSON.stringify(r)))).map(s => JSON.parse(s));

    // Append to payload
    const payload = {
      ...data,
      internalRefs: uniqueInternal,
      externalRefs: uniqueExternal,
    };
    
    // Call the parent onSubmit
    onSubmit(payload as any);
  };

  return (
    <div className="space-y-6 mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-900">Section Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 305.001" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-900">Section Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter formal section title" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chapterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-gray-900">Select Chapter</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a chapter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chapters.map((chapter: any) => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.code ? `${chapter.code} - ` : ""}CHAPTER {chapter.number}. {chapter.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                <FormField
                  control={form.control}
                  name="subChapter"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="font-semibold text-gray-900">Subchapter (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SUBCHAPTER A. GENERAL PROVISIONS" {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Main Legal Content</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Added by</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="addedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Practice Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="practiceNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Case Law</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="caseLaw"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Attorney General Opinions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="agOpinions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Ethics Commission Opinions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="ethicsOpinions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Cross Reference</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="crossReferences"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor value={field.value || ""} onChange={field.onChange} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 pt-4 pb-12">
            {isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/sections")}
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
                : "Create Section"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
