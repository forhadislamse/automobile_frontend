"use client";

import { motion, Variants } from "framer-motion";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

const WhatYouGet = () => {
  const benefits = [
    {
      title: "Standardized Process",
      description:
        "A bulletproof diagnostic workflow that every technician follows, every time.",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
    },
    {
      title: "Real-time Monitoring",
      description:
        "See exactly where every diagnostic job stands without leaving your office.",
      icon: <Zap className="w-6 h-6 text-white" />,
    },
    {
      title: "Profit Protection",
      description:
        "Eliminate unpaid diagnostic time and stop parts-swapping on your dime.",
      icon: <BarChart3 className="w-6 h-6 text-white" />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, rotate: 2 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
        duration: 1,
      },
    },
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
        >
          {/* Content Side */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <motion.span
              variants={itemVariants}
              className="text-[#8B2323] font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
            >
              The Package
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="text-[36px] md:text-[54px] font-bold text-[#0D2B1D] leading-[1.1] mb-8"
            >
              Everything You Need to <br />
              <span className="text-[#8B2323]">Regain Control</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-lg md:text-xl mb-12 max-w-xl"
            >
              Stop the chaos. Our platform provides the structure and visibility
              needed to turn your diagnostic department into a profit center.
            </motion.p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex gap-6 group cursor-default"
                >
                  <div className="shrink-0 w-12 h-12 bg-[#0D2B1D] rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#8B2323] transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0D2B1D] mb-2 group-hover:text-[#8B2323] transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image Side */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 relative">
            <motion.div variants={imageVariants} className="relative z-10">
              <div className="relative aspect-4/5 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/images/WYG_image_one.png"
                  alt="Diagnostic platform interface"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Secondary Image Overlapping */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-10 -left-10 w-2/3 aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-20"
              >
                <Image
                  src="/images/WYG_image_two.png"
                  alt="Mobile technician interface"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Decorative Background Element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#f8f9fa] -z-10 rounded-full blur-3xl opacity-50"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatYouGet;
