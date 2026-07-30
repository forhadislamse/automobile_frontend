"use client";

import { Button } from "@/components/ui/button";
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

type ChartEntry = { day: string; users: number };

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartEntry }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-900">
          {data.payload.day}
        </p>
        <p className="text-sm font-bold text-blue-600">{data.value} Users</p>
      </div>
    );
  }
  return null;
};

// const timeRanges = [
//   { label: "This Week", value: "week" },
//   { label: "This Month", value: "month" },
//   { label: "This Year", value: "year" },
// ];

export default function ActiveUsersChart({
  chartData,
}: {
  chartData: ChartEntry[];
}) {
  const [timeRange, setTimeRange] = useState("week");

  const maxDay = chartData.reduce(
    (max, entry) => (entry.users > max.users ? entry : max),
    chartData[0] ?? { day: "", users: 0 },
  ).day;

  const yMax = Math.max(...chartData.map((d) => d.users), 10);

  return (
    <Card className="w-full border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-md font-semibold text-slate-900">
          Active Users
        </CardTitle>

        <Button variant="outline">This Week</Button>

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
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
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
              domain={[0, yMax + 5]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0)" }}
            />
            <Bar dataKey="users" radius={[8, 8, 0, 0]} isAnimationActive>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === maxDay ? "#1e3a8a" : "#c7d2fe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
