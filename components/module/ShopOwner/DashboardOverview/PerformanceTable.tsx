"use client";

import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

interface Technician {
  sessions: string;
  id: string;
  fullName: string;
  email: string;
  profileImage: string;
  totalSessions: number;
}

interface PerformanceTableProps {
  performanceTable: Technician[];
}

const PerformanceTable = ({ performanceTable }: PerformanceTableProps) => {
  const columns = useMemo<ColumnDef<Technician>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Technician Name",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.fullName}</p>
        ),
      },
      {
        accessorKey: "email",
        header: "Email Address",
        cell: ({ row }) => (
          <p className="text-gray-700">{row.original.email}</p>
        ),
      },
      {
        accessorKey: "sessions",
        header: "Sessions",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original?.sessions}</p>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl bg-white shadow pb-3 mt-4">
      <div className="pb-4 px-4 pt-2">
        <RWTable columns={columns} data={performanceTable} />
      </div>
    </div>
  );
};

export default PerformanceTable;
