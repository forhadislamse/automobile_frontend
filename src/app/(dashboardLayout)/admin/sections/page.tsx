"use client";

import { useState } from "react";
import { useGetAllSectionsQuery, useDeleteSectionMutation, useGetAllChaptersQuery } from "@/redux/api/guideApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function SectionsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterChapterId, setFilterChapterId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch Chapters for the Filter Dropdown
  const { data: chaptersData } = useGetAllChaptersQuery({});
  const chapters = chaptersData?.data || [];

  // Fetch Sections
  const { data: response, isLoading, error } = useGetAllSectionsQuery({
    searchTerm,
    chapterId: filterChapterId !== "all" ? filterChapterId : undefined,
    page,
    limit,
  });

  const [deleteSection] = useDeleteSectionMutation();
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006064]"></div>
          <p className="text-sm text-muted-foreground">Loading sections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading sections. Please try again later.
        </div>
      </div>
    );
  }

  const sections: any[] = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / (meta.limit || 10));

  const startRecord = (meta.page - 1) * meta.limit + 1;
  const endRecord = Math.min(meta.page * meta.limit, meta.total);

  const handleDelete = async () => {
    if (!sectionToDelete) return;
    try {
      await deleteSection(sectionToDelete).unwrap();
      toast.success("Section deleted successfully");
      setSectionToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete section");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all sections of the legal guide
          </p>
        </div>
        <Link href="/admin/sections/create">
          <Button className="bg-[#006064] hover:bg-[#00838F] text-white px-6 rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Add New Section
          </Button>
        </Link>
      </div>

      <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search sections by name or number..."
              className="pl-10 py-6 text-base border-gray-200 focus:border-[#006064] focus:ring-1 focus:ring-[#006064] rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-[280px]">
            <Select 
              value={filterChapterId} 
              onValueChange={(val) => {
                setFilterChapterId(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="py-6 border-gray-200 rounded-lg bg-gray-50/50">
                <SelectValue placeholder="Filter by Chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters.map((ch: any) => (
                  <SelectItem key={ch.id} value={ch.id}>
                    Ch {ch.number}: {ch.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                <TableHead className="font-medium text-sm text-gray-700 h-14 px-6">Section No.</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Section Title</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Chapter no.</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14">Last updated</TableHead>
                <TableHead className="font-medium text-sm text-gray-700 h-14 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length > 0 ? (
                sections.map((section: any) => (
                  <TableRow
                    key={section.id}
                    className="hover:bg-gray-50/50 border-b border-gray-100 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{section.number}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-900 uppercase">
                        {section.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">{section.chapter?.number || "N/A"}</span>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-gray-600">
                      {section.updatedAt
                        ? format(new Date(section.updatedAt), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/sections/edit/${section.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Dialog open={sectionToDelete === section.id} onOpenChange={(isOpen) => isOpen ? setSectionToDelete(section.id) : setSectionToDelete(null)}>
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
                                This will permanently delete section {section.number}. This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSectionToDelete(null)}>Cancel</Button>
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
                      ? `No sections found matching "${searchTerm}".`
                      : "No sections found."}
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
