"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetOwnerDashboardStatsQuery } from "@/redux/api/dashboardApi";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  ClipboardCheck, 
  Loader2,
  Calendar,
  Zap
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const OwnerDashboard = () => {
  const { data: stats, isLoading } = useGetOwnerDashboardStatsQuery({});

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const dashboardData = (stats as any)?.data || {};
  const weeklyActivity = dashboardData.weeklyActivity || [];
  const technicianPerformance = dashboardData.technicianPerformance || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Sessions", value: dashboardData.totalSessions || 0, icon: Zap, color: "bg-blue-500" },
          { label: "Active Technicians", value: technicianPerformance.length, icon: Users, color: "bg-emerald-500" },
          { label: "Efficiency Rate", value: "94%", icon: TrendingUp, color: "bg-amber-500" },
          { label: "System Status", value: "Online", icon: Activity, color: "bg-purple-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-lg bg-white overflow-hidden relative group">
              <div className={`absolute top-0 right-0 p-3 ${stat.color} text-white rounded-bl-3xl opacity-20 group-hover:opacity-40 transition-opacity`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="text-3xl font-black text-blue-900">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity Chart */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white rounded-[2rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-blue-900">Weekly Activity</h3>
              <p className="text-sm text-gray-400">Total diagnostic sessions performed per day</p>
            </div>
            <Calendar className="text-blue-500 w-6 h-6" />
          </div>

          <div className="flex items-end justify-between h-48 gap-2 px-2">
             {weeklyActivity.map((day: any, i: number) => (
                <div key={day.date} className="flex flex-col items-center gap-3 flex-1">
                   <motion.div 
                     initial={{ height: 0 }}
                     animate={{ height: `${Math.min(day.count * 20, 100)}%` }}
                     transition={{ duration: 0.8, delay: i * 0.1 }}
                     className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg relative group"
                   >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         {day.count} sessions
                      </div>
                   </motion.div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {new Date(day.date).toLocaleDateString([], { weekday: 'short' })}
                   </span>
                </div>
             ))}
          </div>
        </Card>

        {/* Technician Performance */}
        <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 lg:p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-blue-900">Top Technicians</h3>
              <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-600 uppercase font-black tracking-widest">Monthly</Badge>
           </div>
           
           <div className="space-y-6">
              {technicianPerformance.length > 0 ? (
                technicianPerformance.map((tech: any) => (
                  <div key={tech.id} className="flex items-center gap-4">
                     <Avatar className="h-10 w-10 border-2 border-blue-100">
                        <AvatarImage src={tech.profileImage} />
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{tech.name.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-blue-900">{tech.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{tech.email}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-black text-blue-600">{tech.sessionCount}</p>
                        <p className="text-[8px] text-gray-400 uppercase">Tasks</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                   <p className="text-sm text-gray-400">No technician activity recorded yet.</p>
                </div>
              )}
           </div>
        </Card>
      </div>

       {/* Latest Diagnostics List */}
       <Card className="border-none shadow-xl bg-white rounded-[2rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-500" />
                Live Diagnostic Feed
             </h3>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-gray-50 uppercase text-[10px] font-black text-gray-400 tracking-[0.2em]">
                      <th className="pb-4 px-2">Technician</th>
                      <th className="pb-4 px-2">Diagnostic Tool</th>
                      <th className="pb-4 px-2">Timestamp</th>
                      <th className="pb-4 px-2 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {dashboardData.recentActivity?.map((act: any, i: number) => (
                      <tr key={i} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-2">
                            <span className="text-xs font-bold text-blue-900">{act.technicianName}</span>
                        </td>
                        <td className="py-4 px-2">
                            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none text-[9px] uppercase font-bold">
                               {act.persona}
                            </Badge>
                        </td>
                        <td className="py-4 px-2">
                            <span className="text-[10px] text-gray-400">{new Date(act.timestamp).toLocaleString()}</span>
                        </td>
                        <td className="py-4 px-2 text-right">
                           <div className="flex items-center justify-end gap-1 text-emerald-500 font-bold text-[10px] uppercase">
                              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                              Completed
                           </div>
                        </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </Card>
    </div>
  );
};

export default OwnerDashboard;
