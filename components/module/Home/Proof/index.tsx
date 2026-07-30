"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, Variants } from "framer-motion";
import { Check, Quote } from "lucide-react";
import Image from "next/image";

const Proof = () => {
  const verified = [
    "Eat up technician hours",
    "Lead to misdiagnosis",
    "Come back after the repair",
    "Slow down bay productivity",
    "Turn profitable jobs into lost time",
  ];

  const reviews = [
    {
      id: 1,
      name: "Mike R.",
      role: "Independent Shop Owner",
      image: "/images/user_1.png",
      review:
        "SmartAutoTech helped tighten up our diagnostic process and reduce wasted time on tough vehicles. Our bays are moving faster and more efficiently.",
    },
    {
      id: 2,
      name: "Carlos M.",
      role: "Shop Owner",
      image: "/images/user_3.png",
      review:
        "It helps my mid-level techs diagnose problems with more confidence and fewer mistakes. That alone has made a difference in our shop.",
    },
    {
      id: 3,
      name: "Jason T.",
      role: "Service Center Owner",
      image: "/images/user_2.png",
      review:
        "The biggest benefit has been fewer misdiagnoses and comebacks. It forces the technician to follow a real diagnostic process.",
    },
    {
      id: 4,
      name: "Sarah L.",
      role: "Diagnostic Lead",
      image: "/images/Sara L.png",
      review:
        "We've seen a 30% reduction in diagnostic time since implementing these protocols. The efficiency gains are undeniable.",
    },
    {
      id: 5,
      name: "David K.",
      role: "Fleet Manager",
      image: "/images/attachment_two.png",
      review:
        "Managing a large fleet means downtime is expensive. This tool ensures our techs get it right the first time, every time.",
    },
    {
      id: 6,
      name: "Robert P.",
      role: "Master Technician",
      image: "/images/Robert P.png",
      review:
        "The step-by-step guidance is a game changer for complex electrical issues. It's like having an expert standing right next to you.",
    },
    {
      id: 7,
      name: "Elena G.",
      role: "Shop Manager",
      image: "/images/user_elena.jpg",
      review:
        "Our shop's reputation has grown because our customers trust our accuracy. This system is the backbone of that trust.",
    },
    {
      id: 8,
      name: "Tom B.",
      role: "Automotive Director",
      image: "/images/tom-b.jpg",
      review:
        "Scaling our operations was tough until we standardized our diagnostics. SmartAutoTech made that transition seamless.",
    },
    {
      id: 9,
      name: "Kevin W.",
      role: "Transmission Specialist",
      image: "/images/Kevin W.png",
      review:
        "Even for specialized work, the logic remains sound. It helps us rule out the simple stuff quickly so we can focus on the core issue.",
    },
    {
      id: 10,
      name: "Lisa M.",
      role: "Euro Car Specialist",
      image: "/images/Lisa M.png",
      review:
        "European cars can be tricky, but having a structured approach saves us hours of troubleshooting. Highly recommended.",
    },
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
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Left Side: Header Content */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <span className="text-[#FF6B00] font-medium  tracking-[0.2em] uppercase text-sm mb-4 block">
                The Proof
              </span>
              <h2 className="text-[36px] md:text-[48px] font-bold text-[#0F172A] leading-[1.1] mb-6">
                One Avoided Comeback <br />
                <span className="">Pays for This</span>
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed max-w-xl"
            >
              That’s real money back in your shop. SmartAutoTech helps you
              reduce wasted diagnostic time on vehicles that:
            </motion.p>
          </div>

          {/* Right Side: Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {verified.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 group"
              >
                <div className="shrink-0 bg-[#FF6B00] p-1.5 rounded-full shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-[17px] text-[#0F172A] font-medium group-hover:text-[#FF6B00] transition-colors duration-300">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="relative"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <div className="flex justify-end items-end mb-10">
              <div className="flex gap-3">
                <CarouselPrevious className="static translate-y-0 bg-white hover:bg-[#FF6B00] hover:text-white transition-all duration-300 border-gray-200 shadow-sm size-12" />
                <CarouselNext className="static translate-y-0 bg-white hover:bg-[#FF6B00] hover:text-white transition-all duration-300 border-gray-200 shadow-sm size-12" />
              </div>
            </div>

            <CarouselContent className="-ml-4">
              {reviews.map((review) => (
                <CarouselItem
                  key={review.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      y: -10,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    }}
                    className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm relative group transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote size={48} className="text-[#0F172A]" />
                    </div>

                    <div className="mb-6 grow">
                      <p className="w-[85%] text-[#4F5655] text-lg leading-relaxed ">
                        {review.review}
                      </p>
                    </div>

                    <div className="flex gap-4 items-center mt-auto pt-6 border-t border-gray-50">
                      <div>
                        <Image
                          src={review.image}
                          alt={review.name}
                          width={200}
                          height={200}
                          className="w-14 h-14 rounded-full object-cover shadow-inner"
                        />
                      </div>
                      <div>
                        <p className="text-[19px] text-[#0F172A] font-bold">
                          {review.name}
                        </p>
                        <p className="text-[15px] text-gray-500 font-medium">
                          {review.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20 flex flex-col items-center text-center"
        ></motion.div>
      </div>
    </section>
  );
};

export default Proof;

