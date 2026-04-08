"use client";

import { useState } from "react";
import { useGetAllUsersQuery } from "@/redux/api/adminApi";
import { Search, CheckCircle, XCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, error } = useGetAllUsersQuery({
    searchTerm,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006064]"></div>
          <p className="text-sm text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading users. Please try again later.
        </div>
      </div>
    );
  }

  // API response shape: { success, message, data: [...], meta: {...} }
  const users: any[] = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#006064]" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all registered users
          </p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-10 border-gray-200 focus:border-[#006064] focus:ring-1 focus:ring-[#006064]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <Card className="border border-gray-100 shadow-sm bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">All Users</CardTitle>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
              {meta.total} total
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-100 hover:bg-gray-50">
                <TableHead className="font-semibold text-xs text-muted-foreground px-6 w-[280px]">
                  User
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Email</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Subscription
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Joined Date
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user: any) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
                  >
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-gray-100">
                          <AvatarImage src={user.profileImage} />
                          <AvatarFallback className="text-xs bg-blue-50 text-blue-700 font-semibold">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-gray-900">
                            {user.fullName}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {user.role?.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      {user.isSubscribed ? (
                        <div className="flex flex-col gap-0.5">
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none w-fit text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            Expires:{" "}
                            {user.subscriptionExpiresAt
                              ? format(new Date(user.subscriptionExpiresAt), "MMM dd, yy")
                              : "N/A"}
                          </span>
                        </div>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-500 border-none text-xs"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt
                        ? format(new Date(user.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#006064] hover:text-[#006064] hover:bg-[#e0f7fa] text-xs"
                      >
                        View Profile
                      </Button>
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
                      ? `No users found matching "${searchTerm}".`
                      : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="w-8 h-8 p-0"
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
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
