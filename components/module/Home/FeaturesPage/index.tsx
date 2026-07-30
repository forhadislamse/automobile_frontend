import AssistantsCard from "./AssistantsCard";
import BillableHours from "./SessionCard";
import { ComebacKsCard } from "./SmartCard";
import TroubleshootingCard from "./TroubleshootingCard";

export default function FeaturesSection() {
  return (
    <main className="min-h-screen bg-background mt-24">
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center container mx-auto text-center">
          <div>
            <div className="flex items-center justify-start gap-2 mb-4 sm:mb-6">
              <span className=" sm:text-sm font-medium text-[#7E0A0A] text-sm uppercase ">
                WHAT YOU GET
              </span>
            </div>

            <h1 className="text-3xl text-start sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Everything You Need to Diagnose Smarter
            </h1>
          </div>

          <div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto leading-relaxed">
              Real, measurable improvements you will notice in your shop from
              the very first diagnostic, without changing how your team works
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            <AssistantsCard />
            <ComebacKsCard />
            <TroubleshootingCard />
            <BillableHours />
          </div>
        </div>
      </section>
    </main>
  );
}
