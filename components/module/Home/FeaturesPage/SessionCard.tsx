"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function BillableHours() {
  const tasks = [1, 2, 3, 4, 5];

  const timeBlocks = [
    {
      id: 1,
      bgColor: "bg-[#E9F7EF]",
      barColor: "bg-[#A3D1B8]",
      sidebarColor: "bg-[#4B8E6A]",
    },
    {
      id: 2,
      bgColor: "bg-[#E9F7EF]",
      barColor: "bg-[#4B8E6A]",
      sidebarColor: "bg-[#4B8E6A]",
    },
    {
      id: 3,
      bgColor: "bg-[#E8F0FE]",
      barColor: "bg-[#AEC4EB]",
      sidebarColor: "bg-[#2563EB]",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="h-full"
    >
      <Card className="bg-white p-8 sm:p-10 border-none shadow-sm rounded-[40px] overflow-hidden h-full flex flex-col justify-center">
        <div className="w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-[18px] sm:text-[24px]  font-bold text-[#1A1A1A] mb-3 tracking-tight">
              More Billable Hours
            </h2>
            <p className="text-[18px] text-[#666666] font-normal">
              Keep bays moving and productive
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Tasks List */}
            <div className="w-full">
              <div className="border border-[#E0E0E0] rounded-[24px] overflow-hidden bg-white">
                <div className="divide-y divide-[#F0F0F0]">
                  {tasks.map((task) => (
                    <motion.div
                      key={task}
                      variants={itemVariants}
                      className="flex items-center justify-between p-5"
                    >
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-[#C4C4C4] rounded-full" />
                        <div className="h-2.5 w-24 bg-[#E0E0E0] rounded-full" />
                      </div>
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00C853]">
                          <Check
                            className="w-4 h-4 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Time Blocks Visualization */}
            <div className="flex flex-col gap-5 w-full">
              {timeBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  variants={itemVariants}
                  className={`${block.bgColor} rounded-r-lg relative h-[88px] flex items-center pl-8 overflow-hidden`}
                >
                  {/* Vertical Sidebar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[5px] ${block.sidebarColor}`}
                  />

                  {/* Horizontal Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 160 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className={`${block.barColor} h-2.5 rounded-full`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
