/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { RWTable } from "@/components/ui/core/NRTable";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllSubscriptionsQuery } from "@/redux/api/adminDashboardApi";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useMemo, useState } from "react";

const LIMIT = 10;

type UserStatus = "Paid" | "Trial" | "Past Due" | "Canceled" | "Incomplete";

const statusStyles: Record<UserStatus, string> = {
  Paid: "bg-green-100 text-green-600 border-green-200",
  Trial: "bg-blue-100 text-blue-600 border-blue-200",
  "Past Due": "bg-orange-100 text-orange-600 border-orange-200",
  Canceled: "bg-gray-100 text-gray-600 border-gray-200",
  Incomplete: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: UserStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
      statusStyles[status] ?? "bg-gray-100 text-gray-600 border-gray-200"
    }`}
  >
    {status.toUpperCase()}
  </span>
);

const SubscriptionTable = () => {
  const [page, setPage] = useState<number>(1);
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryParams: Record<string, string | number> = { page, limit: LIMIT };
  if (planFilter !== "all") queryParams.category = planFilter;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: subscriptionData } = useGetAllSubscriptionsQuery(queryParams);

  const subscriptions = subscriptionData?.data ?? [];
  const totalItems = subscriptionData?.meta?.total ?? 0;
  const totalPages = Math.ceil(totalItems / LIMIT);

  const handlePlanChange = (val: string) => {
    setPlanFilter(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "shopName",
        header: "Shop Name",
        cell: ({ row }) => (
          <p className="text-gray-700">{row.original.shopName}</p>
        ),
      },
      {
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.orderId}</p>
        ),
      },
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.plan}</p>
        ),
      },
      {
        accessorKey: "billingCycle",
        header: "Billing Cycle",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.billingCycle}</p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.paymentMethod}</p>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center my-6 justify-end">
        <div className="flex items-center gap-3">
          <Link href="/admin/subscription/maintenance">
            <Button className="rounded-full">
              Subscriptions Plan Maintenance
            </Button>
          </Link>

          <Select value={planFilter} onValueChange={handlePlanChange}>
            <SelectTrigger className="w-36 h-10 rounded-full bg-[#f8f7f7]">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="PROFESSIONAL">Professional</SelectItem>
              <SelectItem value="EUROPEAN">European</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36 h-10 rounded-full bg-[#f8f7f7]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Trial">Trial</SelectItem>
              <SelectItem value="Past Due">Past Due</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
              <SelectItem value="Incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-xl bg-white shadow mt-4">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Subscription & Billing
          </h2>
        </div>

        <div className="pb-4 px-4">
          <RWTable columns={columns} data={subscriptions} />
        </div>

        {totalPages > 1 && (
          <TablePagination
            totalPage={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionTable;
