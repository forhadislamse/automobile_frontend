"use client";

import OwnerDashboard from "@/components/module/Dashboard/Owner";
import { useAppSelector } from "@/redux/hooks";
import { useDecodedToken } from "@/src/hooks/useDecodedToken";
import { motion } from "framer-motion";
import { LayoutDashboard, ShieldAlert } from "lucide-react";

const UserPage = () => {
  const token = useAppSelector((state) => state.auth.token);
  const decodedToken = useDecodedToken(token);
  const role = decodedToken?.role;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6"
    >
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-blue-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            {role === "USER" ? "Shop Overview" : "Technician Dashboard"}
        </h1>
        <p className="text-blue-500 font-medium">
            {role === "USER" 
                ? "Manage your shop activity, track diagnostics, and monitor technician performance." 
                : "Welcome back! Access your diagnostic tools from the sidebar to start troubleshooting."}
        </p>
      </div>

      {role === "USER" ? (
        <OwnerDashboard />
      ) : role === "TECHNICIAN" ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] shadow-xl border border-blue-50 text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <LayoutDashboard className="w-10 h-10" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-blue-900">Technician Control Center</h2>
                <p className="text-blue-400 mt-2 max-w-md">Please use the "AI Diagnostics" tab in the sidebar to access advanced vehicle troubleshooting tools.</p>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldAlert className="w-16 h-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Unsupported Role</h2>
            <p className="text-gray-500">Contact your administrator if you believe this is an error.</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserPage;
