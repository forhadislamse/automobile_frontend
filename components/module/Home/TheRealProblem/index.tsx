"use client";

import { motion, Variants } from "framer-motion";
import ProblemCard from "./ProblemCard";

const TheRealProblem = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="container mx-auto mt-20 px-4 md:mt-32">
      <motion.div
        className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:items-end"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="lg:w-3/5">
          <motion.p
            variants={itemVariants}
            className="text-[#FF6B00] text-sm font-medium uppercase tracking-widest mb-3"
          >
            The real problem
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-[#0F172A] text-3xl font-extrabold sm:text-4xl lg:text-5xl leading-tight"
          >
            Most Shops Don’t Have a <br className="hidden lg:block" />
            Diagnostic Problem.
          </motion.h2>
        </div>
        <motion.div variants={itemVariants} className="lg:w-1/3">
          <p className="text-lg text-[#4F5655] leading-relaxed">
            They have a
            <span className="text-primary font-bold decoration-blue-500/30 underline-offset-4 decoration-4">
              {" "}
              diagnostic control problem.
            </span>{" "}
            When technicians don’t follow a structured process:
          </p>
        </motion.div>
      </motion.div>
      <div>
        <ProblemCard />
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="flex justify-center md:w-[25%] text-lg bg-[#e9f0ff] border-s-4 border-[#042055] mt-6 p-4 text-[#4F5655] leading-relaxed">
            That’s where your profit is leaking.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TheRealProblem;

