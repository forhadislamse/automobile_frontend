/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMeQuery } from "@/redux/api/authApi";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const { data: getUser } = useGetMeQuery({}) as any;
  const user = getUser?.data;
  const isSubscribed = user?.isSubscribed;
  const role = user?.role;

  console.log("role", role);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 mt-14 overflow-hidden">
      <section className="relative min-h-screen w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero_banner.jpg"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-linear-to-r from-black/40 via-black/20 to-transparent"
        />

        <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center gap-12 px-4 lg:flex-row lg:justify-between lg:px-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-2xl text-center text-white lg:text-left"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-black tracking-tight sm:text-6xl lg:text-[64px] leading-tight"
            >
              STOP <span className="text-white-400">GUESSING</span>
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                START BILLING
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 mb-10 text-lg text-gray-200 sm:text-[20px] max-w-xl"
            >
              Control your diagnostic process.
              <br className="hidden sm:block" />
              Reduce wasted time. Increase billable hours per bay.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-5 lg:justify-start"
            >
              <Link
                // href={`${role === "TECHNICIAN" ? "/chat" : "/shop-owner/dashboard"}`}
                href="/register"
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-white px-8 py-4 text-base font-bold text-primary transition-all"
              >
                <span className="relative z-10">
                  Try It on Your Next Problem Car
                </span>
                <ArrowUpRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>

              <a
                href="/#how-works"
                className="rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black sm:px-10"
              >
                How It Works
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 inline-block border-l-4 border-white bg-white/5 p-3 backdrop-blur-md"
            >
              <p className="text-lg font-medium  text-gray-100">
                Built for real repair shops. Not a generic AI tool.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative element */}
        {/* <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest">
              Scroll to explore
            </span>
            <div className="h-10 w-px bg-linear-to-b from-white/50 to-transparent" />
          </div>
        </motion.div> */}
      </section>
    </main>
  );
}

