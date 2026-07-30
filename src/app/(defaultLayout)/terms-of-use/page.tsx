"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Shield,
  FileText,
  Info,
  AlertTriangle,
  Key,
  Printer,
  Search,
  ArrowRight,
  ChevronRight,
  BookOpen,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Check
} from "lucide-react";
import Link from "next/link";

interface TermSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  tags: string[];
}

export default function TermsOfUsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("agreement");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const sections: TermSection[] = [
    {
      id: "agreement",
      title: "Agreement to Terms",
      icon: Scale,
      tags: ["agreement", "accept", "terms", "using", "accessing"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          By accessing or using SmartAutoTech, you agree to the following Terms of Use.
        </p>
      )
    },
    {
      id: "service-description",
      title: "Service Description",
      icon: BookOpen,
      tags: ["service", "description", "diagnostics", "support", "technicians"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech provides AI-assisted automotive diagnostic guidance designed to support professional repair technicians.
        </p>
      )
    },
    {
      id: "no-guarantee",
      title: "No Guarantee of Accuracy",
      icon: AlertCircle,
      tags: ["accuracy", "guarantee", "testing", "informational", "verify"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech provides informational diagnostic assistance only. Users are responsible for verifying all diagnostic results, testing procedures, and repair decisions.
        </p>
      )
    },
    {
      id: "professional-responsibility",
      title: "Professional Responsibility",
      icon: Info,
      tags: ["professional", "responsibility", "judgment", "manufacturer", "procedures"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Users acknowledge that SmartAutoTech does not replace professional judgment, hands-on testing, or manufacturer repair procedures.
        </p>
      )
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      icon: Shield,
      tags: ["acceptable", "use", "prohibited", "misuse", "disrupt", "unlawful", "sharing"],
      content: (
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Users agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-gray-600 dark:text-gray-300">
            <li>Misuse or attempt to disrupt the platform</li>
            <li>Share unauthorized access credentials</li>
            <li>Use the platform for unlawful purposes</li>
          </ul>
        </div>
      )
    },
    {
      id: "account-access",
      title: "Account Access",
      icon: Key,
      tags: ["account", "access", "credentials", "activity", "responsibility"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Users are responsible for all activity associated with their account credentials.
        </p>
      )
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: FileText,
      tags: ["intellectual", "property", "branding", "software", "content"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          All SmartAutoTech branding, software, and platform content remain the property of SmartAutoTech.
        </p>
      )
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      icon: Shield,
      tags: ["liability", "limitation", "damages", "losses", "repair", "interruption", "business"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech shall not be liable for damages, losses, repair outcomes, or business interruption resulting from the use of the platform.
        </p>
      )
    },
    {
      id: "termination",
      title: "Termination",
      icon: RefreshCw,
      tags: ["termination", "suspend", "terminate", "account", "violations"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          SmartAutoTech reserves the right to suspend or terminate accounts for violations of these terms.
        </p>
      )
    },
    {
      id: "changes",
      title: "Changes",
      icon: RefreshCw,
      tags: ["changes", "updates", "periodically", "acceptance", "revised"],
      content: (
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          These terms may be updated periodically. Continued use of the platform constitutes acceptance of revised terms.
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
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00ffff]/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

          {/* Tagline */}
          <div className="flex items-center gap-2 mb-4">
            {/* <span className="h-[2px] w-8 bg-blue-300 rounded-full" /> */}
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-blue-200">Legal Agreement</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            SmartAutoTech Terms of Use
          </h1>

          <p className="text-blue-100 max-w-2xl text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-light">
            By accessing or using SmartAutoTech, you agree to the following Terms of Use.
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
                <span className="opacity-70">Audience: </span>
                <span className="font-semibold text-white">Professional Technicians</span>
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
                <Label htmlFor="search" className="sr-only">Search Terms</Label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search terms..."
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
                <h4 className="text-sm font-bold mb-1">Need Clarification?</h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  For official inquiries, data permissions, or security disclosures, connect with our team.
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
                          Clause 0{idx + 1}
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
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No Matching Terms Found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  We couldn't find any terms matching "{searchQuery}". Try searching for broader terms like "liability", "access", or "agreement".
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
                    Acceptance and Core Understanding
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    By signing up, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 bg-[#042055] hover:bg-[#042055]/95 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md shadow-[#042055]/15 text-center cursor-pointer"
                  >
                    Accept & Register
                    <Check className="w-4.5 h-4.5" />
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300 font-bold text-sm px-6 py-3 rounded-xl transition text-center cursor-pointer"
                  >
                    Privacy Policy
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
