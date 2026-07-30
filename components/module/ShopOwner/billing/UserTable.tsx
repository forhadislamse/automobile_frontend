"use client";

import { Button } from "@/components/ui/button";
import { RWTable } from "@/components/ui/core/NRTable";
import { ColumnDef } from "@tanstack/react-table";
import { Download, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type UserStatus = "Paid" | "UNPAID";

type BillingItem = {
  id: string;
  activationDate: string;
  plan: string;
  amount: number;
  status: UserStatus;
  ownerName?: string;
  shopName?: string;
};

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

const BillingTable = ({ billing }: { billing: BillingItem[] }) => {
  const [selectedRow, setSelectedRow] = useState<BillingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  const handleDownload = (row: BillingItem) => {
    const dataStr = JSON.stringify(row, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `billing-${row.id}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const columns = useMemo<ColumnDef<BillingItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
      },
      {
        accessorKey: "activationDate",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.original.activationDate);
          return (
            <p className="text-sm text-gray-700">
              {isNaN(date.getTime())
                ? "Invalid date"
                : date.toLocaleDateString()}
            </p>
          );
        },
      },
      {
        accessorKey: "plan",
        header: "Plan",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <span>${row.original.amount}</span>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                setSelectedRow(row.original);
                setIsModalOpen(true);
              }}
            >
              View
            </Button>

            <Download
              className="w-4 h-4 cursor-pointer"
              onClick={() => handleDownload(row.original)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="rounded-xl bg-white shadow mt-4">
      <div className="pb-4 px-4 pt-2">
        <RWTable columns={columns} data={billing || []} />
      </div>

      {isModalOpen && selectedRow && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[420px] shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-4">Billing</h2>

            {/* Content */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Billing Date</span>
                <span className="font-medium">
                  {new Date(selectedRow.activationDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{selectedRow.id}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-gray-500">Shop Owner Name</span>
                <span className="font-medium">
                  {selectedRow.ownerName || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Shop Name</span>
                <span className="font-medium">
                  {selectedRow.shopName || "N/A"}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-gray-500">Plan</span>
                <span className="font-medium">{selectedRow.plan}</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-500">Price</span>
                <span className="font-semibold">${selectedRow.amount}</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-6">
              <Button
                className="w-full rounded-full bg-[#0B2A5B] hover:bg-[#0B2A5B]/90 text-white flex items-center justify-center gap-2"
                onClick={() => handleDownload(selectedRow)}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingTable;

