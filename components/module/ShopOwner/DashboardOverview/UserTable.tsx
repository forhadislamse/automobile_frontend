/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type UserStatus = "Paid" | "UNPAID";

const statusStyles: Record<UserStatus, string> = {
  Paid: "bg-green-100 text-green-600 border-green-200",
  UNPAID: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: UserStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status === "Paid" ? "PAID" : "UNPAID"}
  </span>
);

const CustomersTable = ({
  recentCompletedJobs,
}: {
  recentCompletedJobs: any;
}) => {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "parentName",
        header: "Parent Name",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.parentName}</p>
        ),
      },
      {
        id: "shopName",
        header: "Shop Name",
        cell: ({ row }) => (
          <p className="text-gray-700">{row.original.caregiverName}</p>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">
            {row.original.date
              ? new Date(row.original.date).toLocaleDateString()
              : "N/A"}
          </p>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.incident} />,
      },
      {
        accessorKey: "technicians",
        header: "Technicians",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.technicians}</p>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl bg-white shadow mt-4">
      <div className="pb-4 px-4 pt-2">
        <RWTable columns={columns} data={recentCompletedJobs} />
      </div>
    </div>
  );
};

export default CustomersTable;
