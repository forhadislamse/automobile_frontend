"use client";

import { useState } from "react";
import { useGetAllChaptersQuery, useDeleteChapterMutation } from "@/redux/api/guideApi";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ChaptersManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, error } = useGetAllChaptersQuery({
    searchTerm,
    page,
    limit,
  });

  const [deleteChapter] = useDeleteChapterMutation();
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006064]"></div>
          <p className="text-sm text-muted-foreground">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading chapters. Please try again later.
        </div>
      </div>
    );
  }

  const chapters: any[] = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const startRecord = (meta.page - 1) * meta.limit + 1;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  const handleDelete = async () => {
    if (!chapterToDelete) return;
    try {
      await deleteChapter(chapterToDelete).unwrap();
      toast.success("Chapter deleted successfully");
      setChapterToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete chapter");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all chapters of the legal guide and their hierarchical content structure.
          </p>
        </div>
        <Link href="/admin/chapters/create">
          <Button className="bg-[#006064] hover:bg-[#00838F] text-white px-6 rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Chapter
          </Button>
        </Link>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search chapters by title or keyword..."
              className="pl-10 py-6 text-base border-gray-200 focus:border-[#006064] focus:ring-1 focus:ring-[#006064] rounded-lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                <TableHead className="font-medium text-sm text-gray-700 h-14 px-6">Chapter No.</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Chapter Title</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Total Sections</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Last updated</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapters.length > 0 ? (
                chapters.map((chapter: any) => (
                  <TableRow
                    key={chapter.id}
                    className="hover:bg-gray-50/50 border-b border-gray-100 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <span className="text-sm text-gray-600">{chapter.number}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-gray-900 uppercase">
                        {chapter.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">{chapter._count?.sections || 0}</span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-600">
                      {chapter.updatedAt
                        ? format(new Date(chapter.updatedAt), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/chapters/edit/${chapter.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Dialog open={chapterToDelete === chapter.id} onOpenChange={(isOpen) => isOpen ? setChapterToDelete(chapter.id) : setChapterToDelete(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                This will permanently delete chapter {chapter.number} and all of its associated sections and references. This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setChapterToDelete(null)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    {searchTerm
                      ? `No chapters found matching "${searchTerm}".`
                      : "No chapters found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Footer */}
          {meta.total > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing {startRecord}-{endRecord} from {meta.total}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg text-gray-500"
                >
                  &lt;
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 p-0 rounded-lg ${p === page ? "bg-[#006064] text-white hover:bg-[#00838F]" : "text-gray-500"}`}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg text-gray-500"
                >
                  &gt;
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
