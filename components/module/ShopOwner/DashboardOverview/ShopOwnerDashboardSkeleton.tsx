const ShopOwnerDashboardSkeleton = () => {
  return (
    <div className="h-screen">
      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
            <div className="h-7 w-2/5 rounded bg-gray-200" />
            <div className="h-3 w-3/5 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-4 mt-4 ">
        {/* Left Column */}
        <div className="lg:col-span-2 bg-[#f3f5f7]  rounded-2xl flex flex-col gap-4 p-4">
          {/* Active Users Chart Skeleton */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-2/5 rounded bg-gray-200" />
              <div className="h-3 w-1/5 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-end gap-1.5 h-60 pt-2">
              {[55, 80, 40, 65, 90, 45, 70, 55, 85, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded bg-gray-200"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-2.5 w-8 rounded bg-gray-200" />
              ))}
            </div>
          </div>

          {/* Recent Billing Table Skeleton */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-3.5 w-2/5 rounded bg-gray-200" />
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-2.5 w-3/5 rounded bg-gray-200" />
                      <div className="h-2.5 w-2/5 rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="h-2.5 w-12 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 bg-[#f3f5f7] rounded-2xl flex flex-col gap-4 p-4">
          {/* Technician Performance Skeleton */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-2/5 rounded bg-gray-200" />
              <div className="h-3 w-1/5 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-center h-60">
              <div className="w-28 h-28 rounded-full bg-gray-200" />
            </div>
            <div className="flex justify-center gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <div className="h-2.5 w-12 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Performance Table Skeleton */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
            <div className="h-3.5 w-2/5 rounded bg-gray-200" />
            <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-7 h-7 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-2.5 w-3/5 rounded bg-gray-200" />
                      <div className="h-2.5 w-2/5 rounded bg-gray-200" />
                    </div>
                  </div>
                  <div className="h-5 w-16 rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboardSkeleton;
