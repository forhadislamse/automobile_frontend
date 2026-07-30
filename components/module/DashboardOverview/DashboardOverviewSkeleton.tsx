const DashboardOverviewSkeleton = () => {
  const shimmer = "animate-pulse bg-gray-200 rounded";

  const TableRows = ({ cols }: { cols: string }) => (
    <div className="border-t border-gray-100">
      <div
        className={`grid gap-0 py-2.5 border-b border-gray-100`}
        style={{ gridTemplateColumns: cols }}
      >
        {Array(cols.split(" ").length)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={`${shimmer} h-2.5 w-[65%]`} />
          ))}
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`grid gap-0 items-center py-3 border-b border-gray-100`}
          style={{ gridTemplateColumns: cols }}
        >
          <div className="flex items-center gap-2.5">
            <div className={`${shimmer} w-8 h-8 rounded-full shrink-0`} />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className={`${shimmer} h-2.5 w-[70%]`} />
              <div className={`${shimmer} h-2 w-[50%]`} />
            </div>
          </div>
          <div className={`${shimmer} h-2.5 w-[55%]`} />
          <div className={`${shimmer} h-2.5 w-[50%]`} />
          <div className={`${shimmer} h-5 w-[65%] rounded-full`} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className={`${shimmer} h-3 w-[55%]`} />
              <div className={`${shimmer} w-9 h-9 rounded-lg shrink-0`} />
            </div>
            <div className={`${shimmer} h-7 w-[42%]`} />
            <div className={`${shimmer} h-2.5 w-[60%]`} />
          </div>
        ))}
      </div>

      {/* Row 2: Customers Table + Active Users Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customers Table */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-3 animate-pulse">
            <div className={`${shimmer} h-3 w-[38%]`} />
            <div className={`${shimmer} h-7 w-[22%] rounded-lg`} />
          </div>
          <div className="border-t border-gray-100">
            <div
              className="grid gap-0 py-2.5 border-b border-gray-100"
              style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr" }}
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${shimmer} h-2.5 w-[65%]`} />
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="grid items-center py-3 border-b border-gray-100 animate-pulse"
                style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr" }}
              >
                <div className="flex items-center gap-2">
                  <div className={`${shimmer} w-8 h-8 rounded-full shrink-0`} />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className={`${shimmer} h-2.5 w-[75%]`} />
                    <div className={`${shimmer} h-2 w-[55%]`} />
                  </div>
                </div>
                <div className={`${shimmer} h-2.5 w-[55%]`} />
                <div className={`${shimmer} h-5 w-[65%] rounded-full`} />
              </div>
            ))}
          </div>
        </div>

        {/* Active Users Chart */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
          <div className="flex justify-between items-center">
            <div className={`${shimmer} h-3 w-[42%]`} />
            <div className={`${shimmer} h-2.5 w-[20%] rounded-full`} />
          </div>
          <div className="flex gap-4 mt-1">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className={`${shimmer} h-2.5 w-14`} />
                <div className={`${shimmer} h-6 w-12`} />
              </div>
            ))}
          </div>
          <div className="flex items-end gap-1 h-full pt-1">
            {[40, 65, 30, 80, 50, 95, 55, 70, 38, 85, 60, 45].map((h, i) => (
              <div
                key={i}
                className={`${shimmer} flex-1 rounded-t`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${shimmer} h-2 w-[8%]`} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: AI Sessions Card + Recent Billing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Sessions Card */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
          <div className={`${shimmer} h-3 w-[50%]`} />
          <div className="flex justify-center py-2">
            <div className="relative w-28 h-28">
              <div className={`${shimmer} w-28 h-28 rounded-full`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[52%] h-[52%] rounded-full bg-white" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`${shimmer} w-2.5 h-2.5 rounded-full shrink-0`}
                  />
                  <div className={`${shimmer} h-2.5 w-20`} />
                </div>
                <div className={`${shimmer} h-2.5 w-8`} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            <div className={`${shimmer} h-2.5 w-[45%]`} />
            <div className={`${shimmer} h-2 w-full rounded-full`} />
            <div className="flex justify-between">
              <div className={`${shimmer} h-2 w-[20%]`} />
              <div className={`${shimmer} h-2 w-[20%]`} />
            </div>
          </div>
        </div>

        {/* Recent Billing Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-3 animate-pulse">
            <div className={`${shimmer} h-3 w-[36%]`} />
            <div className={`${shimmer} h-7 w-[20%] rounded-lg`} />
          </div>
          <div className="border-t border-gray-100">
            <div
              className="grid gap-0 py-2.5 border-b border-gray-100"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 0.8fr" }}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`${shimmer} h-2.5 w-[65%] animate-pulse`}
                />
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="grid items-center py-3 border-b border-gray-100 animate-pulse"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 0.8fr" }}
              >
                <div className="flex items-center gap-2">
                  <div className={`${shimmer} w-8 h-8 rounded-full shrink-0`} />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className={`${shimmer} h-2.5 w-[70%]`} />
                    <div className={`${shimmer} h-2 w-[50%]`} />
                  </div>
                </div>
                <div className={`${shimmer} h-2.5 w-[60%]`} />
                <div className={`${shimmer} h-2.5 w-[55%]`} />
                <div className={`${shimmer} h-5 w-[70%] rounded-full`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewSkeleton;
