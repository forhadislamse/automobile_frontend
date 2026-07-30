/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { RWTable } from "@/components/ui/core/NRTable";
import { useGetAllPlansQuery } from "@/redux/api/adminDashboardApi";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { UpdateSubscriptionModal } from "./UpdateSubscriptionModal";

type Plan = {
  id: string;
  name: string;
  category: string;
  description: string;
  currency: string;
  technicianLimit: number;
  hasTrial: boolean;
  isActive: boolean;
  features: (string | { name: string; isActive: boolean })[];
  prices: { duration: string; price: number }[];
  createdAt: string;
  updatedAt: string;
};

const MaintenanceTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Plan | null>(null);

  const { data: maintenanceData } = useGetAllPlansQuery() as any;
  const maintenance: Plan[] = maintenanceData?.data ?? [];

  const columns = useMemo<ColumnDef<Plan>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Plan",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            <p className="text-xs text-gray-500">{row.original.category}</p>
          </div>
        ),
      },
      {
        id: "price",
        header: "Price",
        cell: ({ row }) => (
          <div className="space-y-1">
            {row.original.prices.map((p) => (
              <p key={p.duration} className="text-sm text-gray-700">
                <span className="font-medium">
                  {row.original.currency} {p.price}
                </span>{" "}
                / {p.duration}
              </p>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "technicianLimit",
        header: "Technicians",
        cell: ({ row }) => (
          <p className="text-sm text-gray-700">
            {row.original.technicianLimit}
          </p>
        ),
      },
      {
        accessorKey: "hasTrial",
        header: "Free Trial",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${row.original.hasTrial
              ? "bg-blue-100 text-blue-600 border-blue-200"
              : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
          >
            {row.original.hasTrial ? "Yes" : "No"}
          </span>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${row.original.isActive
              ? "bg-green-100 text-green-600 border-green-200"
              : "bg-red-100 text-red-600 border-red-200"
              }`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
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

export default MaintenanceTable;

