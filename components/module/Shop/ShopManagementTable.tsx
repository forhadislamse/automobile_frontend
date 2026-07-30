/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminShopsStatusMutation,
  useGetAllShopsQuery,
} from "@/redux/api/adminDashboardApi";

import { AlertCircle, CheckCircle2, ChevronDown, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type StatusType = "ACTIVE" | "INACTIVE" | "BLOCKED" | "INVITED" | "SUSPENDED" | "INCOMPLETE";

interface ApiTechnician {
  id: string;
  fullName: string;
  email: string;
  totalSessions: number;
}

interface ApiShop {
  id: string;
  fullName: string;
  email: string;
  shopName: string;
  status: StatusType;
  plan: { id: string; name: string } | null;
  technicians: ApiTechnician[];
}

const PLAN_OPTIONS = [
  { label: "All Plans", value: "all" },
  { label: "Basic Shop Plan", value: "BASIC" },
  { label: "Professional Shop Plan", value: "PROFESSIONAL" },
  { label: "European Specialist Plan", value: "EUROPEAN" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Invited", value: "INVITED" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Incomplete", value: "INCOMPLETE" },
];

const StatusBadge = ({ status }: { status: StatusType }) => {
  const isActive = status === "ACTIVE";
  const isIncomplete = status === "INCOMPLETE";
  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${
        isActive ? "bg-green-100 text-green-700" :
        isIncomplete ? "bg-amber-100 text-amber-700" :
        "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}

      {status.charAt(0) + status.slice(1).toLowerCase()}
    </div>
  );
};

const ShopManagementTable = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [adminShopsStatus, { isLoading: isUpdating }] =
    useAdminShopsStatusMutation();

  const queryParams: {
    page: number;
    limit: number;
    category?: string;
    status?: string;
  } = { page: currentPage, limit };

  if (planFilter !== "all") queryParams.category = planFilter;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data, isLoading, isFetching } = useGetAllShopsQuery(queryParams);

  const shops: ApiShop[] = data?.data ?? [];
  const totalItems: number = data?.meta?.total ?? 0;

  const toggleRow = (shopId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(shopId) ? next.delete(shopId) : next.add(shopId);
      return next;
    });
  };

  // Reset to page 1 whenever a filter changes
  const handlePlanChange = (value: string) => {
    setPlanFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDeleteOrSuspend = async (shopId: string, status: StatusType) => {
    try {
      const payload = {
        id: shopId,
        status,
      };

      await adminShopsStatus(payload);

      toast.success("Shop status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center my-6 justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Shop &amp; User Management
          </h1>
          <div className="flex items-center gap-3">
            {/* Plan filter */}
            <Select value={planFilter} onValueChange={handlePlanChange}>
              <SelectTrigger className="w-44 h-10 rounded-full bg-[#f8f7f7]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-36 h-10 rounded-full bg-[#f8f7f7]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loading />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 w-8" />
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  Shop Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  No. of Technicians
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <React.Fragment key={shop.id}>
                  {/* ── Shop row ── */}
                  <tr className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 w-8">
                      <button
                        onClick={() => toggleRow(shop.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        aria-label="Toggle technicians"
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-gray-600 transition-transform ${
                            expandedRows.has(shop.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {shop.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{shop.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{shop.shopName}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {shop.plan?.name ?? (
                        <span className="text-gray-400 italic">No plan</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={shop.status} />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {shop.technicians.length}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {shop.status === "ACTIVE" && !shop.plan && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteOrSuspend(
                              shop.id as string,
                              "INCOMPLETE",
                            )
                          }
                          className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800 text-xs px-3 py-1 font-semibold rounded-md h-8"
                          title="Mark as Incomplete"
                        >
                          Mark Incomplete
                        </Button>
                      )}
                      {shop.status === "ACTIVE" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteOrSuspend(
                              shop.id as string,
                              "SUSPENDED",
                            )
                          }
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          aria-label="Suspend shop"
                          title="Suspend"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteOrSuspend(shop.id as string, "ACTIVE")
                          }
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                          aria-label="Activate shop"
                          title="Activate"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>

                  {/* ── Expanded technicians row ── */}
                  {expandedRows.has(shop.id) && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0">
                        <div className="bg-gray-50 px-6 py-4">
                          {shop.technicians.length === 0 ? (
                            <p className="text-sm text-gray-400 italic px-2">
                              No technicians assigned to this shop.
                            </p>
                          ) : (
                            <div className="bg-white rounded-lg border">
                              <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                                      No
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                                      Technician Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                                      Email Address
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                                      Sessions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {shop.technicians.map((tech, index) => (
                                    <tr
                                      key={tech.id}
                                      className="border-b hover:bg-gray-50 transition-colors last:border-0"
                                    >
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {index + 1}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {tech.fullName}
                                      </td>
                                      <td className="px-4 py-3 text-sm text-gray-700">
                                        {tech.email}
                                      </td>
                                      <td className="px-4 py-3 text-sm font-medium text-red-600">
                                        {tech.totalSessions}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Empty state */}
      {!isLoading && !isFetching && shops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <p className="text-lg font-medium">No shops found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      <TablePagination
        totalPage={Math.ceil(totalItems / limit)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ShopManagementTable;

