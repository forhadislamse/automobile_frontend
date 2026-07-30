"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const AssistantsCard = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="h-full"
    >
      <Card className="p-8 sm:p-10 border-0 bg-[#F9F9F9] shadow-sm rounded-[40px] overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-[18px] sm:text-[24px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
            Faster Diagnostics
          </h2>
          <p className="text-[18px] text-[#666666] font-normal">
            Spend less time chasing problems
          </p>
        </div>

        {/* Visual Content */}
        <div className="relative flex-1 flex flex-col items-center justify-center pt-8">
          {/* Main Diagnostic Steps Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-7 w-full max-w-[420px] z-30 relative mb-[-10px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] font-bold text-[#1A1A1A]">
                Diagnostic steps
              </h3>
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray="88"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    className="opacity-100"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    className="opacity-20"
                  />
                </svg>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                className="h-full bg-[#0F172A] rounded-full"
              />
            </div>
          </motion.div>

          {/* Stacked Items Container */}
          <div className="w-full max-w-[380px] flex flex-col gap-10 items-center">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                style={{
                  zIndex: 20 - i,
                  marginTop: i === 0 ? "0px" : "-55px",
                  scale: 1 - i * 0.06,
                  opacity: 1 - i * 0.2,
                }}
                className="w-full bg-[#EFF6FF] border border-white/50 rounded-2xl p-5 flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  {/* Progress Bar Inside Card */}
                  <div className="h-2.5 bg-gray-200 rounded-full w-[60%] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${80 - i * 15}%` }}
                      transition={{
                        duration: 1.5,
                        delay: 1 + i * 0.2,
                        ease: "easeOut",
                      }}
                      className="h-full bg-[#1A1A1A] rounded-full"
                    />
                  </div>
                </div>
                <Check
                  className="w-6 h-6 text-[#1A1A1A] shrink-0 opacity-80"
                  strokeWidth={2.5}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AssistantsCard;
