export default function PlanSelectionSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="px-4 pb-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`p-8 flex flex-col rounded-xl border-2 border-gray-100 ${
                  index === 1 ? "scale-105" : ""
                }`}
              >
                {/* Plan name */}
                <div className="h-7 w-3/4 bg-gray-200 rounded-md animate-pulse mb-3" />

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Toggle */}
                <div className="my-4">
                  <div className="h-9 w-44 bg-gray-100 rounded-full animate-pulse" />
                </div>

                {/* Price */}
                <div className="flex items-end gap-2 mb-4">
                  <div className="h-12 w-28 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse mb-1" />
                </div>

                {/* Savings badge */}
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-4" />

                {/* Trial badge */}
                <div className="h-3 w-36 bg-gray-100 rounded animate-pulse mb-2" />

                {/* CTA Button */}
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse mb-6 mt-2" />

                {/* Technician limit */}
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mb-4" />

                {/* Features */}
                <div className="space-y-3 mt-auto">
                  {Array.from({
                    length: index === 2 ? 6 : index === 1 ? 5 : 3,
                  }).map((_, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse shrink-0" />
                      <div
                        className="h-4 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${65 + Math.random() * 25}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
