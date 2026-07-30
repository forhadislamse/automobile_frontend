"use client";

import MetricCard from "@/components/shared/MetricCardDashboard";

import PageLoading from "@/components/shared/PageLoading";
import { RWTable } from "@/components/ui/core/NRTable";
import { useGetTechniciansManagementStatsQuery } from "@/redux/api/shopOwnerDashboardApi";
import { ColumnDef } from "@tanstack/react-table";
import { Sparkles, UserMinus, Users } from "lucide-react";
import { useMemo } from "react";
import ActionCell from "./ActionCell";

type Technician = {
  id: string;
  fullName: string;
  email: string;
  passkey: string;
  status: UserStatus;
  totalSessions: number;
  createdAt: string;
};

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

const TechnicianManagement = () => {
  const { data: managementStatsData, isLoading: managementStatsLoading } =
    useGetTechniciansManagementStatsQuery({});

  const managementStats = managementStatsData?.data;
  const activeTechnicians = managementStats?.activeTechnicians || 0;
  const activeInvitations = managementStats?.activeInvitations || {
    sent: 0,
    remaining: 0,
  };
  const activePlan = managementStats?.activePlan || "N/A";
  const nextRenewal = managementStats?.nextRenewal || "N/A";
  const technicians = managementStats?.technicians || [];

  const metrics = [
    {
      title: "Active Technicians",
      value: activeTechnicians.count || 0,
      month: activeTechnicians.subtitle || "N/A",
      icon: <Users className="text-[#00C566]" />,
      bg: "bg-[#e6f9f0]",
    },
    {
      title: "Active Invitations",
      value: activeInvitations.sent ?? 0,
      invitations: activeInvitations.remaining ?? "N/A",
      icon: <UserMinus className="text-[#1B64F6]" />,
      bg: "bg-[#F0F5FF]",
    },
    {
      title: "Active Plan",
      plan: activePlan?.name ?? "N/A",
      nextRenewal: activePlan?.nextRenewal
        ? new Date(activePlan.nextRenewal).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      icon: <Sparkles className="text-[#F5CC1D]" />,
      bg: "bg-[#fdf9e8]",
    },
  ];

  const columns = useMemo<ColumnDef<Technician>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Technician Name",
      },
      {
        accessorKey: "email",
        header: "Email / Plan",
      },
      {
        accessorKey: "passkey",
        header: "Passkey",
      },
      {
        accessorKey: "createdAt",
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
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <ActionCell id={row.original.id} status={row.original.status} />
        ),
      },
    ],
    [],
  );

  if (managementStatsLoading) {
    return (
      <div>
        <PageLoading />
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
      <div className="rounded-xl bg-white shadow mt-4">
        <div className="pb-4 px-4 pt-2">
          <RWTable columns={columns} data={technicians} />
        </div>
      </div>
    </div>
  );
};

export default TechnicianManagement;
