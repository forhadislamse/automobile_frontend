"use client";

import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type BillingStatus = "PAID" | "UNPAID";

type BillingRecord = {
  orderId: string;
  date: string;
  shopOwner: string;
  plan: string;
  amount: number;
  status: BillingStatus;
};

const statusStyles: Record<BillingStatus, string> = {
  PAID: "bg-green-100 text-green-600 border-green-200",
  UNPAID: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: BillingStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status}
  </span>
);

const RecentBillingTable = ({
  recentBilling,
}: {
  recentBilling: BillingRecord[];
}) => {
  const columns = useMemo<ColumnDef<BillingRecord>[]>(
    () => [
      {
        id: "orderId",
        header: "Order ID",
        cell: ({ row }) => (
          <p className="font-mono text-sm font-medium text-gray-900">
            {row.original.orderId}
          </p>
        ),
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">
            {new Date(row.original.date).toLocaleDateString()}
          </p>
        ),
      },
      {
        id: "shopOwner",
        header: "Shop Owner",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.shopOwner}</p>
        ),
      },
      {
        id: "plan",
        header: "Plan",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.plan}</p>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <p className="text-sm font-semibold text-gray-900">
            {row.original.amount === 0 ? "Free" : `$${row.original.amount}`}
          </p>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl bg-white shadow">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Billing</h2>
      </div>
      <div className="pb-4 px-4">
        <RWTable columns={columns} data={recentBilling} />
      </div>
    </div>
  );
};

export default RecentBillingTable;
