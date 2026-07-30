"use client";

import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";

const TheSolution = () => {
  const features = [
    "One step at a time",
    "No guessing",
    "No skipped tests",
    "No parts swapping without proof",
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const testimonialVariants: Variants = {
    hidden: { opacity: 0, x: 20, y: 20 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, delay: 0.6, ease: "easeOut" },
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
              className="relative aspect-4/3 w-full overflow-hidden rounded-[2.5rem] shadow-2xl"
            >
              <Image
                src="/images/foreman.png"
                alt="Master Technician working in the bay"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Testimonial Card */}
            <motion.div
              variants={testimonialVariants}
              className="absolute -bottom-10 -right-4 md:right-10 bg-white p-6 md:p-8 rounded-3xl shadow-xl max-w-[320px] md:max-w-[380px] border border-gray-100 z-10"
            >
              <p className="text-gray-800 text-lg md:text-xl font-medium leading-relaxed mb-6">
                &ldquo;We used to lose hours. Now my guys get to the answer
                faster. It just keeps them on track.&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/images/user.png"
                    alt="Mike R."
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Mike R.</h4>
                  <p className="text-sm text-gray-500">Shop Owner</p>
                </div>
              </div>
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
              variants={itemVariants}
              className="text-[#7E0A0A] text-sm font-medium uppercase xl:tracking-wider mb-4 block"
            >
              THE SOLUTION
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="text-[24px] md:text-[36px] lg:text-[48px] font-bold text-[#0D2B1D] leading-[1.1] mb-8"
            >
              A Master Technician That Never Leaves the Bay
            </motion.h2>
            <motion.div
              variants={itemVariants}
              className="space-y-6 text-gray-600 text-[16px] md:text-[20px] mb-12"
            >
              <p>
                SmartAutoTech enforces a step-by-step diagnostic process in your
                shop.
              </p>
              <p>
                It guides your technician, forces test validation, and keeps the
                job moving, just like a seasoned Master Technician.
              </p>
            </motion.div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <div className="bg-[#8B2323] p-1 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium md:text-lg">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TheSolution;
