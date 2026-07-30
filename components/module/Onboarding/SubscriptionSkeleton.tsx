const SubscriptionSkeleton = () => {
  return (
    <div className="w-full h-screen bg-white animate-pulse">
      <div className="flex flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-[45%] bg-[#F3F6F3] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Header */}
            <div className="mb-10">
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-3"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            </div>

            {/* Plan Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-10 shadow">
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-[55%] p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 bg-white">
          <div className="w-full max-w-xl mx-auto">
            {/* Contact Info */}
            <div className="mb-10">
              <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>

              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-10">
              <div className="h-4 w-40 bg-gray-300 rounded mb-6"></div>

              <div className="space-y-6">
                {/* Card */}
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-xl mb-3"></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
                </div>

                {/* Country */}
                <div>
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                  <div className="h-12 w-full bg-gray-200 rounded-xl"></div>

                  <div className="space-y-3 mt-3">
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="space-y-4">
              <div className="h-14 w-full bg-gray-300 rounded-xl"></div>

              <div className="flex justify-center gap-3">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
