/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { UpdateSubscriptionModal } from "./UpdateSubscriptionModal";

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

const SubscriptionTable = ({ maintenance }: { maintenance: any }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "plan",
        header: "Plan",
        cell: ({ row }) => <p className="text-gray-700">{row.original.plan}</p>,
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <p className="font-medium text-gray-900">{row.original.price}</p>
        ),
      },
      {
        accessorKey: "technician",
        header: "Technician",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.technician}</p>
        ),
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">{row.original.duration}</p>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.status as UserStatus} />
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <Button
            onClick={() => {
              setSelectedRow(row.original);
              setModalOpen(true);
            }}
          >
            Update Plan
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <div className="rounded-xl bg-white shadow mt-4">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Subscription & Billing
          </h2>
        </div>

        <div className="pb-4 px-4">
          <RWTable columns={columns} data={maintenance} />
        </div>
      </div>

      <UpdateSubscriptionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={selectedRow}
      />
    </>
  );
};

export default SubscriptionTable;
