import FAQ from "@/components/module/Home/FAQ/FAQ";
import FeaturesSection from "@/components/module/Home/FeaturesPage";
import HeroSection from "@/components/module/Home/HeroSection";
import HowWorks from "@/components/module/Home/HowWorks";
import PricingPage from "@/components/module/Home/Pricing";
import Proof from "@/components/module/Home/Proof";
import ShopEconomics from "@/components/module/Home/ShopEconomics";
import StartSharing from "@/components/module/Home/StartSharing";
import TheRealProblem from "@/components/module/Home/TheRealProblem";
import TheSolution from "@/components/module/Home/TheSolution";

const page = () => {
  return (
    <div className="flex flex-col gap-4 ">
      <section id="hero-section">
        <HeroSection />
      </section>

      <section id="the-real-problem">
        <TheRealProblem />
      </section>

      <section id="the-solution">
        <TheSolution />
      </section>

      <section id="how-works">
        <HowWorks />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="shop-economics">
        <ShopEconomics />
      </section>

      <section id="proof">
        <Proof />
      </section>

      <section id="pricing">
        <PricingPage />
      </section>

      <section id="the-real-problem">
        <FAQ />
      </section>

      <section id="start-sharing">
        <StartSharing />
      </section>
    </div>
  );
};

export default page;
