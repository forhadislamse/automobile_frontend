/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import PageLoading from "@/components/shared/PageLoading";
import { RWTable } from "@/components/ui/core/NRTable";
import {
  useGetBillingDataQuery,
  useGetMySubscriptionsQuery,
  useUpdateAutoRenewMutation,
} from "@/redux/api/shopOwnerDashboardApi";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type UserStatus = "Paid" | "UNPAID";

type BillingItem = {
  invoiceUrl: string;
  id: string;
  orderId?: string;
  date?: string;
  activationDate?: string;
  planName?: string;
  plan?: string;
  amount: number;
  status: UserStatus;
};

const statusStyles: Record<UserStatus, string> = {
  Paid: "bg-green-100 text-green-600 border-green-200",
  UNPAID: "bg-red-100 text-red-600 border-red-200",
};

const StatusBadge = ({ status }: { status: UserStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {status.toUpperCase()}
  </span>
);

const BillingTable = () => {
  const { data: billingData, isLoading } = useGetBillingDataQuery({});
  const billing: BillingItem[] = billingData?.data || [];

  const { data: mySubscriptionsData, isLoading: isLoadingSub } =
    useGetMySubscriptionsQuery({});
  const mySubscriptions = mySubscriptionsData?.data || [];

  const subscriptionId = mySubscriptions?.[0]?.id || null;

  const [autoRenewState, setAutoRenewState] = useState(false);

  const [updateAutoRenew, { isLoading: isUpdating }] =
    useUpdateAutoRenewMutation();

  useEffect(() => {
    if (mySubscriptions?.length) {
      setAutoRenewState(mySubscriptions[0].autoRenew);
    }
  }, [mySubscriptions]);

  const handleToggle = async (value: string) => {
    setAutoRenewState(!autoRenewState);

    const payload = {
      subscriptionId,
      value,
    };

    try {
      const res = await updateAutoRenew(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Subscription updated successfully");
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          "Failed to update subscription. Please try again.",
      );
      setAutoRenewState(!value);
    }
  };

  const columns = useMemo<ColumnDef<BillingItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        cell: ({ row }) =>
          row.original.orderId?.slice(0, 6).toUpperCase() || row.original.id,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) =>
          new Date(
            row.original.date || row.original.activationDate || "",
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
      },
      {
        accessorKey: "planName",
        header: "Plan",
        cell: ({ row }) => row.original.planName || row.original.plan,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => `$${row.original.amount}`,
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
          <a
            href={row.original.invoiceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="h-5 w-5" />
          </a>
        ),
      },
    ],
    [],
  );

  if (isLoading || isLoadingSub) return <PageLoading />;

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between bg-[#e9f0ff] rounded-xl px-5 py-4 shadow-sm">
        <div className="text-sm">
          <span className="font-medium text-gray-800">
            Current Subscription :
          </span>{" "}
          <span className="text-gray-700">
            {mySubscriptions?.[0]?.plan?.name || "Basic Shop Plan"}
          </span>{" "}
          <span className="text-gray-500">
            (Expires on{" "}
            {mySubscriptions?.[0]?.expiresAt
              ? new Date(mySubscriptions[0].expiresAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  },
                )
              : "N/A"}
            )
          </span>
        </div>

        <div className="flex items-center bg-gray-200 rounded-full p-1">
          <button
            onClick={() => handleToggle("cancel-renewal")}
            disabled={isUpdating}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              !autoRenewState ? "bg-primary text-white shadow" : "text-gray-600"
            }`}
          >
            Do not renew
          </button>

          <button
            onClick={() => handleToggle("resume-renewal")}
            disabled={isUpdating}
            className={`px-4 py-1.5 text-sm rounded-full transition ${
              autoRenewState ? "bg-primary text-white shadow" : "text-gray-600"
            }`}
          >
            Auto Renew
          </button>
        </div>
      </div> */}

      {/* Table */}
      <div className="rounded-xl bg-white shadow">
        <h2 className="text-xl font-semibold text-gray-800 p-4 border-b">
          Billing Management
        </h2>

        <div className="h-[480px] p-4">
          <RWTable columns={columns} data={billing} />
        </div>
      </div>
    </div>
  );
};

export default BillingTable;
