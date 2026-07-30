"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqItems = [
  {
    id: "1",
    question: "Is this replacing my technicians?",
    answer:
      "Absolutely not. SmartAutoTech is a tool designed to empower your technicians, not replace them. Think of it as a master technician standing by their side, providing the right data and structured guidance at the exact moment they need it, helping them work faster and with more confidence.",
  },
  {
    id: "2",
    question: "Will this actually save my shop time?",
    answer:
      "That depends on how often your shop loses time on diagnostics, intermittent issues, and comebacks. If your technicians spend extra time chasing problems, replacing unnecessary parts, or getting stuck on difficult vehicles, this tool can absolutely save time. Even saving 10–15 minutes per diagnostic vehicle adds up quickly across multiple bays every week.",
  },
  {
    id: "3",
    question: "Is this just another AI chatbot?",
    answer:
      "No. That’s the difference. Most AI tools answer questions like a chatbot. SmartAutoTech is designed to guide technicians through a structured diagnostic process. It directs the technician step by step, requests test results, and adjusts the troubleshooting path based on what the technician finds. It’s built more like a diagnostic Master Technician than a conversational chatbot.",
  },
  {
    id: "4",
    question: "Will my technicians actually use it?",
    answer: (
      <div className="space-y-4">
        <p>
          If it slows them down, no. Technicians will only use a tool that helps
          them get to the answer faster and doesn&apos;t add frustration. The
          system has to be fast, direct, and useful on real vehicles in a real
          shop environment.
        </p>
        <p>The shops that will benefit the most are the ones looking to:</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
          {[
            "Reduce diagnostic time",
            "Improve consistency between technicians",
            "Reduce comebacks",
            "Help mid-level techs become stronger diagnosticians",
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
];

export default function FAQ() {
  return (
    <section className="py-24 bg-[#F9FAFB] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex  items-center justify-center text-center mb-16">
          <div className="flex flex-col justify-start items-start text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-start gap-3 mb-6"
            >
              <span className="text-sm text-[#7E0A0A] font-medium uppercase  tracking-[0.2em]">
                FAQ
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-6 tracking-tight leading-[1.1]"
            >
              Everything You Need to Know
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-start text-lg max-w-2xl mx-auto font-medium"
          >
            Find answers to the most common questions from shop owners and
            technicians.
          </motion.p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="group border-none bg-white rounded-2xl px-2 sm:px-4 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] data-[state=open]:shadow-[0_8px_20px_rgba(0,0,0,0.06)] data-[state=open]:bg-white"
              >
                <AccordionTrigger className="flex-1 hover:no-underline py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-5 text-left w-full">
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gray-50 items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                      <span className="text-[#1A1A1A] font-bold text-sm">
                        {index + 1 < 10 ? `${index + 1}` : index + 1}
                      </span>
                    </div>
                    <span className="text-[#1A1A1A] font-bold text-lg sm:text-xl tracking-tight leading-tight flex-1">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 sm:px-[72px] pb-6 pt-2">
                  <div className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA Footer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-gray-700 font-semibold">
              Still have questions?{" "}
              <a
                href="#contact"
                className="text-red-500 font-bold hover:underline ml-1"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
