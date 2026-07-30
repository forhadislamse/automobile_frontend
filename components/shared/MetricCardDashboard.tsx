/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface MetricCardProps {
  title: string;
  value?: number | string;
  bg: string;
  month?: string;
  invitations?: string;
  plan?: string;
  nextRenewal?: string;
  icon: React.ReactNode;
  allplan?: any;
}

export default function MetricCard({
  title,
  value,
  bg,
  icon,
  month,
  invitations,
  plan,
  allplan,
  nextRenewal,
}: MetricCardProps) {
  console.log("invitations");

  return (
    <div className="flex items-start bg-card justify-between rounded-xl p-6">
      {/* Left: Text content */}
      <div className="space-y-1">
        <p className="text-[16px] font-bold text-[#4F5655]">{title}</p>

        <div className="flex items-center gap-4 mt-10">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {/* Plan badges */}
          {allplan && (
            <div className="flex flex-wrap gap-2 mt-1">
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-500">Professional</span>
                <span className="text-[#00C566] font-semibold text-sm">
                  {allplan.professional ?? 0}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-500">European</span>
                <span className="text-[#00C566] font-semibold text-sm">
                  {allplan.european ?? 0}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <span className="text-xs text-gray-500">Basic</span>
                <span className="text-[#00C566] font-semibold text-sm">
                  {allplan.basic ?? 0}
                </span>
              </div>
            </div>
          )}
          {month && (
            <div className="text-sm font-medium rounded-full bg-[#e6f9f0] text-[#00C566] py-1 px-2">
              {month}
            </div>
          )}

          {typeof invitations !== "undefined" && (
            <div className="text-sm font-medium bg-[#f0f5ff] text-[#1b64f6] rounded-full py-1 px-2">
              {invitations} Remaining Invitations
            </div>
          )}
        </div>

        {/* Plan Info */}
        {plan && (
          <p className="text-sm text-gray-600 mt-2 font-manrope">{plan}</p>
        )}
        {nextRenewal && (
          <p className="text-xl text-black ">Next renewal: {nextRenewal}</p>
        )}
      </div>

      {/* Right: Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${bg} text-white`}
      >
        {icon}
      </div>
    </div>
  );
}
