"use client";

import DiagnosticChat from "@/components/module/Diagnostic/DiagnosticChat";
import { motion } from "framer-motion";

const DiagnosticsPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6"
    >
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">AI Diagnostic Specialist</h1>
        <p className="text-blue-500">Advanced AI assistance for complex vehicle troubleshooting and mechanical diagnostics.</p>
      </div>

      <DiagnosticChat />
    </motion.div>
  );
};

export default DiagnosticsPage;
