"use client";

import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type UserStatus = "ACTIVE" | "INVITED" | "SUSPENDED" | "BLOCKED";

const statusStyles: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-600 border-green-200",
  INVITED: "bg-blue-100 text-blue-600 border-blue-200",
  SUSPENDED: "bg-yellow-100 text-yellow-600 border-yellow-200",
  BLOCKED: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: UserStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status}
  </span>
);

type Technician = {
  id: string;
  fullName: string;
  email: string;
  passkey: string;
  status: UserStatus;
  totalSessions: number;
  createdAt: string;
};

const TechniciansTable = ({ technicians }: { technicians: Technician[] }) => {
  const columns = useMemo<ColumnDef<Technician>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
      },
      {
        accessorKey: "fullName", // was: technicianName
        header: "Technician Name",
      },
      {
        accessorKey: "email", // was: emailAddress
        header: "Email / Plan",
      },
      {
        accessorKey: "passkey",
        header: "Passkey",
      },
      {
        accessorKey: "createdAt", // was: activationDate
        header: "Activation Date",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </p>
        ),
      },
      {
        accessorKey: "totalSessions",
        header: "Sessions",
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
    <div className="rounded-xl bg-white shadow mt-4">
      <div className="pb-4 px-4 pt-2">
        <RWTable columns={columns} data={technicians} />
      </div>
    </div>
  );
};

export default TechniciansTable;
