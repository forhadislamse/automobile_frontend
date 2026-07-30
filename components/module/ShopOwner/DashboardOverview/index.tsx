"use client";

import MetricCard from "@/components/shared/MetricCardDashboard";
import { useGetDashboardOverviewQuery } from "@/redux/api/shopOwnerDashboardApi";
import { Sparkles, UserMinus, Users } from "lucide-react";
import ActiveUsersChart from "./ActiveUsersChart";
import PerformanceTable from "./PerformanceTable";
import RecentBillingTable from "./RecentBillingTable";
import ShopOwnerDashboardSkeleton from "./ShopOwnerDashboardSkeleton";
import TechnicianPerformance from "./technicianPerformance";

const ShopOwnerDashboardOverview = () => {
  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery({});

  const dashboard = dashboardData?.data || {};

  const activeTechnicians = dashboard?.activeTechnicians;
  const activeInvitations = dashboard?.activeInvitations;
  const activePlan = dashboard?.activePlan;
  const diagnosticsActivity = dashboard?.diagnosticsActivity ?? [];
  const recentBilling = dashboard?.recentBilling ?? [];
  const technicianPerformance = dashboard?.technicianPerformance;
  const technicians = dashboard?.technicianPerformance ?? [];
  const totalSessions = technicians?.data ?? 0;

  console.log("technicianPerformance", technicianPerformance);

  // const performanceTable = [
  //   {
  //     id: "1",
  //     technicianName: "John Doe",
  //     emailAddress: "ko1E1@example.com",
  //     sessions: "2023-06-01",
  //   },
  //   {
  //     id: "1",
  //     technicianName: "John Doe",
  //     emailAddress: "ko1E1@example.com",
  //     sessions: "2023-06-01",
  //   },
  //   {
  //     id: "1",
  //     technicianName: "John Doe",
  //     emailAddress: "ko1E1@example.com",
  //     sessions: "2023-06-01",
  //   },
  // ];

  const metrics = [
    {
      title: "Active Technicians",
      value: activeTechnicians?.count ?? 0,
      month: activeTechnicians?.subtitle,
      icon: <Users className="text-[#00C566]" />,
      bg: "bg-[#e6f9f0]",
    },
    {
      title: "Active Invitations",
      value: activeInvitations?.sent ?? 0,
      invitations: activeInvitations?.remaining ?? 0,
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

  if (isLoading) return <ShopOwnerDashboardSkeleton />;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mt-4">
        <div className="lg:col-span-2 bg-[#f3f5f7] rounded-2xl">
          <ActiveUsersChart diagnosticsActivity={diagnosticsActivity} />
          <RecentBillingTable
            recentCompletedJobs={recentBilling.slice(0, 5) || []}
          />
        </div>

        <div className="lg:col-span-2 bg-[#f3f5f7]">
          <TechnicianPerformance
            technicianPerformance={technicianPerformance}
          />
          <PerformanceTable performanceTable={totalSessions} />
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboardOverview;
