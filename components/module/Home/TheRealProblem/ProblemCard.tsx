"use client";

import { motion } from "framer-motion";
import { Car, Search, Timer, Wrench } from "lucide-react";

const problems = [
  {
    title: "Diagnostics Take Too Long",
    description:
      "Without a clear process, technicians waste time figuring out what to check next.",
    icon: <Timer className="text-white h-6 w-6" />,
    color: "bg-slate-900",
    shadow: "shadow-slate-200",
    costLabel: "THE TIME COST",
  },
  {
    title: "Problems Get Missed",
    description:
      "Important steps are skipped, leading to incomplete or incorrect diagnoses.",
    icon: <Search className="text-white h-6 w-6" />,
    color: "bg-[#fc6b45]",
    shadow: "shadow-orange-100",
    costLabel: "THE PROFIT COST",
  },
  {
    title: "Parts Get Replaced Without Proof",
    description:
      "Guesswork leads to unnecessary parts replacement instead of verified fixes.",
    icon: <Wrench className="text-white h-6 w-6" />,
    color: "bg-[#6d2ab9]",
    shadow: "shadow-purple-100",
    costLabel: "THE PARTS COST",
  },
  {
    title: "Vehicles Come Back",
    description:
      "Unresolved issues result in comebacks that cost time, money, and trust.",
    icon: <Car className="text-white h-6 w-6" />,
    color: "bg-[#c52ec3]",
    shadow: "shadow-pink-100",
    costLabel: "THE REWORK COST",
  },
];

const ProblemCard = () => {
  return (
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl ${problem.shadow}`}
          >
            {/* Background Decoration */}
            <div
              className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-[0.03] transition-transform group-hover:scale-150 ${problem.color}`}
            />

            <div
              className={`${problem.color} mb-6 flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
            >
              {problem.icon}
            </div>

            <h3 className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
              {problem.title}
            </h3>

            <p className="text-base leading-relaxed text-gray-500">
              {problem.description}
            </p>

            <div className="mt-6 flex items-center text-sm font-bold text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="mr-2 h-0.5 w-4 bg-gray-300" />
              {problem.costLabel}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProblemCard;

