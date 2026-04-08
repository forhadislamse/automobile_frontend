"use client";

import { useGetDashboardStatsQuery } from "@/redux/api/adminApi";
import { Users, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const { data: response, isLoading, error } = useGetDashboardStatsQuery(undefined);

  // API response shape: { success, message, data: { totalUsers, activeSubscriptions, ... }, meta }
  const stats = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006064]"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          ⚠️ Error loading dashboard statistics. Please try again later.
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: "Registered members",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: "bg-emerald-100 text-emerald-600",
      trend: "Currently active",
    },
    {
      title: "Monthly Revenue",
      value: `$${((stats?.monthlyRevenue ?? 0) as number).toLocaleString()}`,
      icon: DollarSign,
      color: "bg-orange-100 text-orange-600",
      trend: "This month",
    },
    {
      title: "Annual Revenue",
      value: `$${((stats?.annualRevenue ?? 0) as number).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-violet-100 text-violet-600",
      trend: "Year to date",
    },
  ];

  const annualRevenueChart: { month: string; revenue: number }[] =
    stats?.annualRevenueChart ?? [];
  const recentSubscriptions: any[] = stats?.recentSubscriptions ?? [];

  const maxRevenue = Math.max(...annualRevenueChart.map((i) => i.revenue), 1);

  return (
    <div className="p-6 space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform overview and key performance indicators
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Revenue Bar Chart */}
        <Card className="border border-gray-100 shadow-sm bg-white xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-5 pb-2">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                Revenue Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Monthly breakdown for this year</p>
            </div>
            <div className="text-xs text-muted-foreground border border-gray-200 rounded-md px-2 py-1 bg-gray-50">
              {new Date().getFullYear()}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="h-[240px] flex justify-between gap-1.5 pt-4">
              {annualRevenueChart.map((item, idx) => {
                const barHeight = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center justify-end gap-1.5 flex-1 min-w-0 h-full">
                    <div 
                      className="relative group flex flex-col items-center justify-end w-full"
                      style={{ height: `${Math.max(barHeight, 4)}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity duration-150 pointer-events-none">
                        ${item.revenue.toLocaleString()}
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full h-full rounded-t-sm transition-all duration-500 ease-out"
                        style={{
                          background:
                            item.revenue === maxRevenue
                              ? "linear-gradient(to top, #006064, #00ACC1)"
                              : "#CBD5E1",
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground font-medium">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscriptions Table */}
        <Card className="border border-gray-100 shadow-sm bg-white xl:col-span-1 h-full">
          <CardHeader className="px-6 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  Recent Subscriptions
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Last 5 paid subscriptions</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 font-medium">
                {recentSubscriptions.length} entries
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-y border-gray-100 hover:bg-gray-50">
                  <TableHead className="font-semibold text-xs text-muted-foreground px-6 whitespace-nowrap">User</TableHead>
                  <TableHead className="font-semibold text-xs text-muted-foreground whitespace-nowrap">Date</TableHead>
                  <TableHead className="font-semibold text-xs text-muted-foreground whitespace-nowrap">Plan</TableHead>
                  <TableHead className="font-semibold text-xs text-muted-foreground text-right pr-6 whitespace-nowrap">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubscriptions.length > 0 ? (
                  recentSubscriptions.map((sub: any) => (
                    <TableRow
                      key={sub.id}
                      className="hover:bg-gray-50 border-b border-gray-50 transition-colors"
                    >
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-gray-100 shrink-0">
                            <AvatarImage src={sub.user?.profileImage} />
                            <AvatarFallback className="text-xs bg-blue-50 text-blue-700 font-semibold">
                              {sub.user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm text-gray-900 truncate max-w-[120px]">
                              {sub.user?.fullName || "Unknown"}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                              {sub.user?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {sub.createdAt
                          ? format(new Date(sub.createdAt), "MMM dd")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                          {sub.plan?.name || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span className="font-bold text-sm text-emerald-600">
                          ${sub.amount}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                      No recent subscriptions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
