"use client";
import MetricCard from "@/components/shared/MetricCardDashboard";
import { useGetDashboardOverviewQuery } from "@/redux/api/adminDashboardApi";
import { CreditCard, MessagesSquare, Store, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import ActiveUsersChart from "./ActiveUsersChart";
import AiSessionsCard from "./AiSessionsCard";
import DashboardOverviewSkeleton from "./DashboardOverviewSkeleton";
import RecentBillingTable from "./RecentBillingTable";
import CustomersTable from "./UserTable";

const DashboardOverview = () => {
  const searchParams = useSearchParams();
  const timeRange = searchParams.get("timeRange") || "month";

  const { data: dashboardData, isLoading } = useGetDashboardOverviewQuery({
    timeRange,
  });
  const dashboard = dashboardData?.data || {};

  const topStats = dashboard?.topStats;
  const recentUsers = dashboard?.recentUsers || [];
  const activeUsersChart = dashboard?.activeUsersChart || [];
  const aiSessions = dashboard?.aiSessions || {};
  const recentBilling = dashboard?.recentBilling || [];

  const allPlans = {
    professional: topStats?.PROFESSIONAL || 0,
    european: topStats?.EUROPEAN || 0,
    basic: topStats?.BASIC || 0,
  };

  const metrics = [
    {
      title: "Active Shops",
      value: topStats?.activeShops || 0,
      icon: <Store className="text-[#7E0A0A]" />,
      bg: "bg-[#fff8f8]",
    },
    {
      title: "Active Subscriptions",
      value: topStats?.activeSubscriptions || 0,
      icon: <CreditCard className="text-[#8051F5]" />,
      bg: "bg-[#e8e3ff]",
      allplan: allPlans,
    },
    {
      title: "Active Users",
      value: topStats?.activeUsers || 0,
      icon: <Users className="text-white" />,
      bg: "bg-blue-400",
    },
    {
      title: "AI Sessions Today",
      value: topStats?.aiSessionsToday || 0,
      icon: <MessagesSquare className="text-white" />,
      bg: "bg-green-400",
    },
  ];

  if (isLoading) return <DashboardOverviewSkeleton />;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4 mt-6">
        <div className="lg:col-span-2">
          <CustomersTable recentUsers={recentUsers.slice(0, 4)} />
        </div>
        <div className="lg:col-span-2 mt-4">
          <div className="bg-white border-0 rounded-2xl">
            <ActiveUsersChart chartData={activeUsersChart} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-4">
        <div className="lg:col-span-1">
          <div className="bg-white border-0 rounded-2xl">
            <AiSessionsCard aiSessions={aiSessions} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white border-0 rounded-2xl">
            <RecentBillingTable recentBilling={recentBilling.slice(0, 4)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
