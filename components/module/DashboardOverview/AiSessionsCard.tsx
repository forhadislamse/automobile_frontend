"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", value: 4200, value2: 3800 },
  { month: "Feb", value: 4000, value2: 3900 },
  { month: "Mar", value: 3800, value2: 4200 },
  { month: "Apr", value: 4500, value2: 4100 },
  { month: "May", value: 5200, value2: 3200 },
  { month: "Jun", value: 5000, value2: 3600 },
  { month: "Jul", value: 6100, value2: 4300 },
  { month: "Aug", value: 5700, value2: 4400 },
  { month: "Sep", value: 4900, value2: 5100 },
  { month: "Oct", value: 5300, value2: 4700 },
  { month: "Nov", value: 5800, value2: 3500 },
  { month: "Dec", value: 6200, value2: 4000 },
];
type AiSessions = {
  yearly: number;
  total: number;
  technicians: number;
};

const timeRanges = [
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

export default function AiSessionsCard({
  aiSessions,
}: {
  aiSessions: AiSessions;
}) {
  const [timeRange, setTimeRange] = useState("month");

  const handleRangeChange = (value: string) => {
    setTimeRange(value);
  };

  console.log("aiSessions", aiSessions);

  const total = aiSessions.total || 0;
  const technicians = aiSessions.yearly || 0;

  return (
    <div className="w-full bg-white rounded-xl px-8 pt-6 pb-20 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">AI Sessions</h2>

        <Select value={timeRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>

          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-b border-gray-200 mb-8" />

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col justify-between">
          <div className="mb-8">
            <h3 className="text-5xl font-bold text-gray-900 mb-2">
              {timeRange === "year"
                ? `${aiSessions.yearly}`
                : `${aiSessions.total}`}
            </h3>
            <p className="text-gray-600">sessions</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-600 text-sm">
              Completed by the technicians
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-700 font-bold text-sm">
                {aiSessions.technicians ?? 0}
              </span>
            </div>
            <p className="text-gray-900 font-medium">
              Technicians
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                stroke="transparent"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Bar dataKey="value" fill="#991B1B" radius={[8, 8, 0, 0]} />
              <Bar dataKey="value2" fill="#FECDD3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
