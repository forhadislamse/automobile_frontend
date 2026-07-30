"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  FileText,
  Lock,
  Database,
  Globe,
  Printer,
  Search,
  ArrowRight,
  ChevronRight,
  UserCheck,
  Mail,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  tags: string[];
}

export default function PrivacyPolicyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("commitment");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const sections: PrivacySection[] = [
    {
      id: "commitment",
      title: "Privacy Commitment",
      icon: Shield,
      tags: ["respect", "commitment", "welcome", "protect", "privacy", "information"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech respects your privacy and is committed to protecting the information you provide while using our platform.
        </p>
      )
    },
    {
      id: "info-collection",
      title: "Information We Collect",
      icon: Database,
      tags: ["collect", "data", "information", "account", "billing", "vehicle", "diagnostic", "usage", "technical"],
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            We may collect:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600 dark:text-gray-300">
            <li>Account information such as name, email address, and shop information</li>
            <li>Billing and subscription information</li>
            <li>Vehicle and diagnostic information entered into the platform</li>
            <li>Usage and technical data related to platform activity</li>
          </ul>
        </div>
      )
    },
    {
      id: "use-of-data",
      title: "How We Use Information",
      icon: Eye,
      tags: ["use", "processing", "improve", "diagnostics", "subscriptions", "billing", "support", "performance", "security"],
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Information collected may be used to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600 dark:text-gray-300">
            <li>Provide and improve SmartAutoTech services</li>
            <li>Support diagnostics and user functionality</li>
            <li>Manage subscriptions and billing</li>
            <li>Provide customer support</li>
            <li>Improve platform performance and security</li>
          </ul>
        </div>
      )
    },
    {
      id: "data-sharing",
      title: "Data Sharing",
      icon: Globe,
      tags: ["sharing", "selling", "trusted", "providers", "hosting", "payment", "analytics", "operations"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech does not sell your personal information. Information may be shared with trusted service providers involved in hosting, payment processing, analytics, or platform operations.
        </p>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      tags: ["security", "measures", "protect", "absolute", "guarantee"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          We use commercially reasonable measures to protect user data; however, no system can guarantee absolute security.
        </p>
      )
    },
    {
      id: "user-responsibility",
      title: "User Responsibility",
      icon: UserCheck,
      tags: ["responsibility", "protecting", "credentials", "unauthorized", "access"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Users are responsible for protecting account credentials and limiting unauthorized access to their accounts.
        </p>
      )
    },
    {
      id: "changes",
      title: "Changes",
      icon: Clock,
      tags: ["changes", "updates", "periodically", "acceptance", "revisions"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          This Privacy Policy may be updated periodically. Continued use of the platform constitutes acceptance of any revisions.
        </p>
      )
    },
    {
      id: "contact",
      title: "Contact",
      icon: Mail,
      tags: ["contact", "questions", "email", "support"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          For questions regarding this policy, contact:{" "}
          <Link
            href="mailto:support@smartautotech.ai"
            className="text-[#042055] font-semibold hover:underline"
          >
            support@smartautotech.ai
          </Link>
        </p>
      )
    }
  ];

  // Filter sections based on search query
  const filteredSections = sections.filter((section) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.tags.some((tag) => tag.includes(query))
    );
  });

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 110,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950/20 py-8 md:py-16 selection:bg-[#042055]/10 selection:text-[#042055]">
      {/* Header Banner - Sleek Dark Gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 print:mb-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#042055] via-[#093582] to-[#124ca6] p-8 md:p-14 text-white shadow-xl shadow-[#042055]/10">
          {/* Subtle background glow graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          {/* Tagline */}
          <div className="flex items-center gap-2 mb-4">
            {/* <span className="h-[2px] w-8 bg-blue-300 rounded-full" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-blue-200">Data Governance</span> */}
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            SmartAutoTech Privacy Policy
          </h1>

          <p className="text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-light">
            SmartAutoTech respects your privacy and is committed to protecting the information you provide while using our platform.
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs md:text-sm text-blue-200">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div>
                <span className="opacity-70">Effective Date: </span>
                <span className="font-semibold text-white">June 13, 2026</span>
              </div>
              <div className="hidden sm:block w-[1px] h-4 bg-white/20 self-center" />
              <div>
                <span className="opacity-70">Standards: </span>
                <span className="font-semibold text-white">GDPR & CCPA Compliant</span>
              </div>
            </div>

            {/* Print action */}
            {/* <button
              onClick={handlePrint}
              className="print:hidden flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-medium px-4 py-2 rounded-xl transition duration-200 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button> */}
          </div>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-10">

          {/* Left Column: Sticky Sidebar & Filters */}
          <div className="lg:col-span-1 print:hidden">
            <div className="sticky top-28 space-y-6">

              {/* Search Bar */}
              <div className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 shadow-sm">
                <Label htmlFor="search" className="sr-only">Search Policy</Label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search policy..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-950 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#042055] dark:focus:ring-blue-800 transition"
                  />
                </div>
              </div>

              {/* Table of Contents List */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  Table of Contents
                </h3>

                <nav className="space-y-1 max-h-[350px] overflow-y-auto pr-1">
                  {filteredSections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition duration-200 text-xs font-medium cursor-pointer ${isActive
                          ? "bg-[#042055] text-white shadow-md shadow-[#042055]/10 scale-[1.02]"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                      >
                        <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition ${isActive ? "rotate-90 text-blue-300" : "opacity-40"}`} />
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}

                  {filteredSections.length === 0 && (
                    <p className="text-xs text-gray-400 italic py-4 text-center">No clauses match your search.</p>
                  )}
                </nav>
              </div>

              {/* Sidebar Quick Action Support Card */}
              {/* <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 p-5 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <h4 className="text-sm font-bold mb-1">Privacy Questions?</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  For questions regarding this policy, contact our support team.
                </p>
                <Link
                  href="mailto:support@smartautotech.ai"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 font-bold transition group"
                >
                  Contact Support
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition duration-200" />
                </Link>
              </div> */}

            </div>
          </div>

          {/* Right Column: Clauses Content List */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredSections.map((section, idx) => {
                const Icon = section.icon;
                const isSelected = activeSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    ref={(el) => {
                      sectionRefs.current[section.id] = el;
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                    className={`group relative rounded-2xl bg-white dark:bg-gray-900 border p-6 md:p-8 transition-all duration-300 shadow-sm scroll-mt-28 ${isSelected
                      ? "border-[#042055]/50 dark:border-blue-900/50 ring-1 ring-[#042055]/20 dark:ring-blue-900/20 shadow-md shadow-[#042055]/5"
                      : "border-gray-200/80 dark:border-gray-800 hover:border-gray-300/80 dark:hover:border-gray-700/80 hover:shadow-md"
                      }`}
                  >
                    {/* Glowing highlight indicator left line */}
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl transition duration-300 ${isSelected ? "bg-[#042055]" : "bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
                      }`} />

                    {/* Section Card Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected
                        ? "bg-[#042055] text-white scale-110 shadow-lg shadow-[#042055]/20"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-800 dark:group-hover:text-gray-200"
                        }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Section 0{idx + 1}
                        </span>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5 group-hover:text-[#042055] dark:group-hover:text-blue-300 transition duration-200">
                          {section.title}
                        </h2>
                      </div>
                    </div>

                    {/* Card Content Section */}
                    <div className="text-gray-700 dark:text-gray-300">
                      {section.content}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredSections.length === 0 && (
              <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800">
                <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No Matching Sections Found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  We couldn't find any policy details matching "{searchQuery}". Try searching for broader terms like "cookies", "collect", or "rights".
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#042055] hover:bg-[#042055]/90 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition duration-200 cursor-pointer"
                >
                  Clear Search Filter
                </button>
              </div>
            )}

            {/* Bottom Professional Closing Callout */}
            <div className="rounded-3xl border border-[#042055]/20 dark:border-blue-900/30 bg-gradient-to-br from-[#042055]/5 to-transparent p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#042055]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#042055]/10 dark:bg-blue-900/30 text-xs font-bold text-[#042055] dark:text-blue-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Agreement Confirmation
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Data Consent & Terms Agreement
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    href="/terms-of-use"
                    className="flex items-center justify-center gap-2 bg-[#042055] hover:bg-[#042055]/95 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md shadow-[#042055]/15 text-center cursor-pointer"
                  >
                    View Terms of Use
                    <ArrowRight className="w-4.5 h-4.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

// Simple placeholder Label component so we don't depend on complex shadcn exports if they aren't fully configured
function Label({ children, className, ...props }: React.ComponentPropsWithoutRef<"label">) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );
}
