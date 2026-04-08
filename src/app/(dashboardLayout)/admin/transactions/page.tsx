"use client";

import { useState } from "react";
import { useGetAllPaidTransactionsQuery } from "@/redux/api/adminApi";
import { HandCoins, CreditCard, Calendar } from "lucide-react";
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

export default function TransactionHistoryPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, error } = useGetAllPaidTransactionsQuery({
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
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading transactions. Please try again later.
        </div>
      </div>
    );
  }

  // API response shape: { success, message, data: [...], meta: {...} }
  const transactions: any[] = response?.data ?? [];
  const meta = response?.meta ?? { total: 0, page: 1, limit: 10 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HandCoins className="h-6 w-6 text-[#006064]" />
          Transaction History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All completed payment transactions on the platform
        </p>
      </div>

      {/* Transactions Table */}
      <Card className="border border-gray-100 shadow-sm bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900">
              Paid Transactions
            </CardTitle>
            <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
              {meta.total} total
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-100 hover:bg-gray-50">
                <TableHead className="font-semibold text-xs text-muted-foreground px-6">User</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">
                  Transaction ID
                </TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Plan</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground">Date</TableHead>
                <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <TableRow
                    key={tx.id}
                    className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
                  >
                    <TableCell className="px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-gray-100">
                          <AvatarImage src={tx.user?.profileImage} />
                          <AvatarFallback className="text-xs bg-blue-50 text-blue-700 font-semibold">
                            {tx.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-900">
                            {tx.user?.fullName || "Unknown"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {tx.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                        {tx.transactionId || "N/A"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <CreditCard className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        {tx.plan?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        {tx.createdAt
                          ? format(new Date(tx.createdAt), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <span className="font-bold text-sm text-emerald-600">${tx.amount}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    No transactions found.
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
