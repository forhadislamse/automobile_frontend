"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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
  { month: "Feb", value: 3800, value2: 4200 },
  { month: "Mar", value: 5200, value2: 3200 },
  { month: "Apr", value: 6100, value2: 4300 },
  { month: "May", value: 4900, value2: 5100 },
  { month: "Jun", value: 5800, value2: 3500 },
];

const technicians = [
  {
    id: 1,
    name: "John",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
  },
  {
    id: 2,
    name: "Sarah",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
  },
  {
    id: 3,
    name: "Mike",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop",
  },
];

export default function AiSessionsCard() {
  const [period, setPeriod] = useState("Monthly");

  return (
    <div className="w-full bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">AI Sessions</h2>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gray-50 border-gray-200 hover:bg-gray-100"
        >
          {period}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-8" />

      <div className="grid grid-cols-2 gap-8">
        {/* Left Section */}
        <div className="flex flex-col justify-between">
          {/* Main Stat */}
          <div className="mb-8">
            <h3 className="text-5xl font-bold text-gray-900 mb-2">42,629</h3>
            <p className="text-gray-600">sessions</p>
          </div>

          {/* Subtitle */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm mb-4">
              Completed by the technicians
            </p>
          </div>

          {/* Technicians */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {technicians.map((tech, idx) => (
                <Avatar
                  key={tech.id}
                  className="w-12 h-12 border-2 border-white shadow-sm"
                  style={{ zIndex: technicians.length - idx }}
                >
                  <AvatarImage src={tech.image} alt={tech.name} />
                  <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p className="text-gray-900 font-medium">1200 Technicians</p>
          </div>
        </div>

        {/* Right Section - Chart */}
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
              <YAxis hide={true} />
              <Bar dataKey="value" fill="#991B1B" radius={[8, 8, 0, 0]} />
              <Bar dataKey="value2" fill="#FECDD3" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
