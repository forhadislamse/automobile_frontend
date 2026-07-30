import { Card } from "@/components/ui/card";
import Image from "next/image";

const TroubleshootingCard = () => {
  return (
    <Card className="p-8 sm:p-10 border-0 bg-[#F9F9F9] shadow-sm rounded-[40px] overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-[18px] sm:text-[24px] font-bold text-[#1A1A1A] mb-3 tracking-tight">
          Better Tech Performance
        </h2>
        <p className="text-[18px] text-[#666666] font-normal">
          Make mid-level techs more effective
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT */}
        <div className="flex gap-3 sm:gap-4 flex-1">
          <div className="shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full text-blue-600 text-sm font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-5 h-5"
              >
                <path d="M135.2 117.4l-26.1 74.6 293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 192c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-320 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 304a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
              </svg>
            </div>
          </div>

          <div>
            <p className="font-medium text-foreground text-sm sm:text-base">
              2019 Honda Civic
            </p>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-[#87c1e5] text-white px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                Engine Stalls
              </span>
              <span className="bg-[#fdcc98] text-white px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                Check Engine Light
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:border-l md:pl-6 border-border flex-1 space-y-4">
          <div>
            <div>
              <Image
                src="/r_logo.png"
                alt="SmartAuto Logo"
                width={500}
                height={500}
                className="object-contain w-30 h-30"
              />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>Possible causes:</p>
              <ul className="list-disc list-inside">
                <li>Faulty spark plugs</li>
                <li>Ignition coil failure</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Step 1: Check spark plugs
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Inspect the spark plugs for wear, damage, or fouling
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TroubleshootingCard;
