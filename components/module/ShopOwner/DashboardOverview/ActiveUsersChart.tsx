"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// const timeRanges = [
//   { label: "This Week", value: "week" },
//   { label: "This Month", value: "month" },
//   { label: "This Year", value: "year" },
// ];

interface DiagnosticsActivity {
  day: string;
  sessions: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { day: string };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-900">
          {data.payload.day}
        </p>
        <p className="text-sm font-bold text-blue-600">{data.value} Sessions</p>
      </div>
    );
  }
  return null;
};

interface ActiveUsersChartProps {
  diagnosticsActivity?: DiagnosticsActivity[];
}

export default function ActiveUsersChart({
  diagnosticsActivity = [],
}: ActiveUsersChartProps) {
  const [timeRange, setTimeRange] = useState("week");

  const sessions = diagnosticsActivity.map((d) => d.sessions);
  const maxSessions = sessions.length > 0 ? Math.max(...sessions) : 0;

  const highlightDay =
    maxSessions > 0
      ? diagnosticsActivity.find((d) => d.sessions === maxSessions)?.day
      : undefined;

  const yAxisMax = Math.max(maxSessions + Math.ceil(maxSessions * 0.2), 10);

  return (
    <Card className="w-full border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-md font-semibold text-slate-900">
          Diagnostic Sessions
        </CardTitle>
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="pt-0">
        {maxSessions === 0 ? (
          <div className="flex h-[350px] flex-col items-center justify-center gap-2 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-sm font-medium">No sessions this week</p>
            <p className="text-xs text-slate-300">
              Activity will appear here once sessions are recorded
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={diagnosticsActivity}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                domain={[0, yAxisMax]}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0,0,0,0)" }}
              />
              <Bar dataKey="sessions" radius={[8, 8, 0, 0]} isAnimationActive>
                {diagnosticsActivity.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.day === highlightDay ? "#1e3a8a" : "#c7d2fe"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
