"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function StartSharing() {
  return (
    <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden bg-[#F8FAFF] py-20">
      {/* Background Decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 md:w-[500px] h-64 md:h-[500px] opacity-40 pointer-events-none -translate-x-1/4">
        <Image
          src="/images/Ellipse 2810.png"
          fill
          alt="Decorative Background"
          className="object-contain"
        />
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-[500px] h-64 md:h-[500px] opacity-30 pointer-events-none translate-x-1/4">
        <Image
          src="/images/Ellipse 2809.png"
          fill
          alt="Decorative Background"
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-[34px] sm:text-[40px] md:text-[56px] lg:text-[60px] text-[#1A2B3B] leading-tight md:font-semibold">
            Try It on Your Next <br /> Tough Vehicle
          </h2>
          <p className="text-base sm:text-lg text-gray-500 mt-6 max-w-md mx-auto leading-relaxed">
            No setup. No learning curve. Use it today.
          </p>
        </motion.div>

        {/* Buttons Container */}
        <a href="#pricing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button className="bg-linear-to-r h-14 w-full sm:w-82 px-12 text-lg font-semibold rounded-2xl flex items-center justify-center gap-3 group ">
              Start Your Free 14-Day Trial
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </a>
      </div>
    </section>
  );
}

