"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#EF4444",
  "#EC4899",
];

export default function TechnicianPerformance({
  technicianPerformance,
}: {
  technicianPerformance: {
    total: number;
    data: {
      id: string;
      fullName: string;
      email: string;
      profileImage: string;
      sessions: number;
    }[];
  };
}) {
  const chartData = technicianPerformance.data.map((tech, index) => ({
    name: tech.fullName,
    value: tech.sessions,
    color: COLORS[index % COLORS.length],
  }));

  const totalSessions = technicianPerformance.total;

  return (
    <div className="bg-white p-7 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-[16px] font-semibold text-[#4F5655]">
            Technician Performance
          </h1>
          {/* <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {/* Chart Card */}
        <div className="p-8 bg-white">
          <div className="flex justify-center items-center min-h-80">
            <div className="relative w-80 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={450}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-gray-900">
                  {totalSessions}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
              </div>
            </div>

            {/* Legend */}
            <div className="ml-12">
              {chartData.map((item, index) => (
                <div key={index} className="mb-4">
                  <div
                    className="text-white px-3 py-2 rounded text-sm font-medium inline-block"
                    style={{ backgroundColor: item.color }}
                  >
                    <div>{item.value} sessions</div>
                    <div className="text-xs font-normal">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
