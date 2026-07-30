"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ComebacKsCard() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="h-full"
    >
      <Card className="bg-[#f9f9f9] p-8 sm:p-10 border-none shadow-sm rounded-[40px] overflow-hidden h-full flex flex-col justify-start">
        <div className="w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-[18px] sm:text-[24px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
              Fewer Comebacks
            </h2>
            <p className="text-[18px] text-[#666666] font-normal">
              Fix it right the first time
            </p>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center space-y-10 py-4">
            {/* Issue Verified Badge */}
            <motion.div variants={badgeVariants} className="relative">
              <div className="bg-[#F8F9FA] border border-[#E0E0E0] rounded-2xl px-10 py-5 text-center shadow-sm">
                <p className="text-[#1A1A1A] font-bold text-lg">
                  Issue Verified
                </p>
              </div>
              {/* Connector line */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 40 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute left-1/2 -bottom-10 w-px bg-[#E0E0E0]"
              />
            </motion.div>

            {/* Success State */}
            <motion.div
              variants={badgeVariants}
              className="flex flex-col items-center gap-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  delay: 0.8,
                }}
                className="w-16 h-16 rounded-full bg-[#00C853] flex items-center justify-center shadow-lg shadow-green-100"
              >
                <CheckCircle2 className="w-9 h-9 text-white" />
              </motion.div>
              <div className="text-center">
                <p className="text-[#1A1A1A] font-bold text-xl">
                  Repair Completed
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

