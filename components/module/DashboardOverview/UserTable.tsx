"use client";

import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type RecentUser = {
  id: string;
  shopOwner: string;
  email: string;
  shopName: string;
  plan: string;
  status: "ACTIVE" | "INACTIVE";
  noOfTechnicians: number;
};

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-600 border-green-200",
  INACTIVE: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}
  >
    {status}
  </span>
);

const CustomersTable = ({ recentUsers }: { recentUsers: RecentUser[] }) => {
  const columns = useMemo<ColumnDef<RecentUser>[]>(
    () => [
      {
        id: "shopOwner",
        header: "Shop Owner",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.shopOwner}</p>
        ),
      },
      {
        id: "shopName",
        header: "Shop Name",
        cell: ({ row }) => (
          <p className="text-gray-700">{row.original.shopName}</p>
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
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "technicians",
        header: "Technicians",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">
            {row.original.noOfTechnicians}
          </p>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl bg-white shadow mt-4">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
      </div>
      <div className="pb-4 px-4">
        <RWTable columns={columns} data={recentUsers} />
      </div>
    </div>
  );
};

export default CustomersTable;
