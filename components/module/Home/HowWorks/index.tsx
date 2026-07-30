/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const HowWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: getUser } = useGetMeQuery({}) as any;
  const user = getUser?.data;
  const isSubscribed = user?.isSubscribed;
  const role = user?.role;

  const steps = [
    {
      title: "Enter the Vehicle information and the problem",
      description:
        "2017 Volkswagen Jetta 1.4T S - Will not start - EPC light on",
    },
    {
      title: "Follow the Diagnostic Steps",
      description: "Clear, structured testing—no fluff",
    },
    {
      title: "Get to the Answer Faster",
      description: "Eliminate guesswork and wasted time",
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20">
          {/* Left Column */}
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-6">
              <span className="text-[#FF6B00] text-sm font-medium uppercase  tracking-wider">
                HOW IT WORKS
              </span>
              <h2 className="text-2xl lg:text-[48px] mb-6 font-semibold text-[#0F172A] leading-[1.05] tracking-tight">
                Simple. Fast. Built for the Shop Floor.
              </h2>
              <p className="text-[20px] text-[#4F5655] mb-6 max-w-lg leading-relaxed">
                A step-by-step process that keeps your technicians focused and
                moving forward
              </p>
            </div>

            <Link
              //      href={`${role === "TECHNICIAN" ? "/chat" : "/shop-owner/dashboard"}`}
              href="/register"
              className="group relative flex items-center justify-start gap-2 overflow-hidden rounded-lg bg-white  py-4 text-base font-bold text-primary transition-all"
            >
              <Button className="bg-[#FF6B00] hover:bg-[#E66000] text-white h-14 w-50 px-14 text-lg rounded-xl flex items-center gap-2 group shadow-xl shadow-blue-900/10 transition-all">
                <span className="relative z-10">Start a Diagnosis</span>
                <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="pt-4"
            >
              <Image
                src="/images/work.png"
                alt="Mechanic working on car"
                width={650}
                height={450}
                className="rounded-4xl shadow-2xl object-cover border border-slate-100"
              />
            </motion.div>
          </div>

          {/* Right Column: Steps */}
          <div className="lg:w-5/12 space-y-8 flex flex-col justify-center">
            {steps.map((step, index) => {
              const isHighlighted =
                hoveredIndex !== null
                  ? hoveredIndex === index
                  : activeStep === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`p-6 rounded-4xl transition-all duration-300 cursor-pointer border-b-4 
                    ${
                      isHighlighted
                        ? "bg-[#f9f9f9] border-[#FF6B00]"
                        : "bg-transparent border-transparent hover:bg-[#f9f9f9]/50"
                    }`}
                >
                  <div className="space-y-4">
                    <p className="text-[#FF6B00] text-[20px] mb-6">
                      Step {index + 1}
                    </p>
                    <div className="space-y-2">
                      <h3 className="text-[20px] font-bold text-[#0F172A]">
                        {step.title}
                      </h3>
                      <p className="text-[16px] text-[#4F5655]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorks;

