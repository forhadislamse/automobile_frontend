"use client";

import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

const ShopEconomics = () => {
  const features = [
    "20 cars/week = 200 minutes",
    "That’s over 3 extra billable hours",
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const textItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -1 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 25,
        duration: 1.2,
      },
    },
  };

  const testimonialVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 30, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.8,
      },
    },
  };

  const bannerVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: 1.4,
      },
    },
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column: Image and Testimonial */}
          <motion.div
            className="relative w-full lg:w-1/2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={imageVariants}
              className="relative aspect-4/4 w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
            >
              <Image
                src="/images/shop-economics.png"
                alt="Master Technician working in the bay"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Testimonial Card */}
            <motion.div
              variants={testimonialVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
              className="absolute bottom-10 -right-4 md:right-10 bg-white p-6 md:p-8 rounded-3xl shadow-xl max-w-[150px] md:max-w-[280px] border border-gray-100 z-10 cursor-default"
            >
              <p className="text-[#4F5655] text-sm md:text-[16px] font-medium leading-relaxed mb-4">
                Time Saved
              </p>

              <p className="text-[#042055] text-xl md:text-2xl font-bold">
                200 mins / week
              </p>
              <p className="text-[#4F5655] text-[10px] md:text-[16px] mt-2 font-medium">
                20 vehicles diagnosed
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div
            className="w-full lg:w-1/2 pt-12 lg:pt-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.span
              variants={textItemVariants}
              className="text-[#FF6B00] font-medium tracking-wider uppercase text-sm mb-4 block"
            >
              Shop Economics
            </motion.span>
            <motion.h2
              variants={textItemVariants}
              className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-[#0F172A] leading-[1.1] mb-8"
            >
              What Is 10 Minutes Per Car Worth
            </motion.h2>
            <motion.div
              variants={textItemVariants}
              className="space-y-6 text-gray-600 text-[18px] md:text-[22px] mb-12 font-light"
            >
              <p>
                If you save just{" "}
                <span className="font-semibold text-[#0F172A]">10 minutes</span>{" "}
                per vehicle:
              </p>
            </motion.div>

            {/* Feature Grid */}
            <div className="flex flex-col gap-5">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={textItemVariants}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 group cursor-default"
                >
                  <div className="bg-[#FF6B00] p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium md:text-xl">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.p
              variants={bannerVariants}
              className="w-full md:w-[80%] lg:w-[70%] text-[#042055] bg-[#f0f5ff] font-bold text-xl px-6 py-4 border-[#042055] border-s-[6px] mt-12 rounded-e-xl shadow-sm"
            >
              That’s real money back in your shop.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShopEconomics;

