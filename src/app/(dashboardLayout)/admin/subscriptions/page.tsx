"use client";

import { useState } from "react";
import { useGetSubscriptionAnalyticsQuery } from "@/redux/api/adminApi";
import { BookOpen, Users, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscribersListPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, error } = useGetSubscriptionAnalyticsQuery({
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006064]"></div>
          <p className="text-sm text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading subscribers. Please try again later.
        </div>
      </div>
    );
  }

  // API response shape:
  // { success, message, data: { activeSubscriptionCount, annualRevenueTotal, data: [...] }, meta: {...} }
  const payload = response?.data;
  const subscriptions: any[] = payload?.data ?? [];
  const activeSubscriptionCount: number = payload?.activeSubscriptionCount ?? 0;
  const annualRevenueTotal: number = payload?.annualRevenueTotal ?? 0;
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#006064]" />
            Subscriptions Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage all active user subscriptions
          </p>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Active Subscriptions
            </CardTitle>
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-3xl font-bold text-gray-900">{activeSubscriptionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently subscribed users</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Annual Revenue (Year-to-Date)
            </CardTitle>
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <div className="text-3xl font-bold text-gray-900">
              ${annualRevenueTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total revenue this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="border border-gray-100 shadow-sm bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                Active Subscriptions List
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paginated list of all paid subscriptions
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
              {meta.total} total
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-100 hover:bg-gray-50">
                <TableHead className="font-semibold text-xs text-muted-foreground px-6">Subscriber</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Current Plan</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Subscription Date</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6">
                  Amount Paid
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub: any) => (
                  <TableRow
                    key={sub.id}
                    className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
                  >
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-100">
                          <AvatarImage src={sub.user?.profileImage} />
                          <AvatarFallback className="text-xs bg-blue-50 text-blue-700 font-semibold">
                            {sub.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-900">
                            {sub.user?.fullName || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {sub.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-200 bg-blue-50 font-medium text-xs"
                      >
                        {sub.plan?.name ?? "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {sub.createdAt
                          ? format(new Date(sub.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="font-bold text-sm text-emerald-600">${sub.amount}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    No active subscriptions found.
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
