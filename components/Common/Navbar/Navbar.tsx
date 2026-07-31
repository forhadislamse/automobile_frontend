/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useGetMeQuery({}) as any;
  const currentUser = userData?.data;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How it works", href: "#how-works" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    setSidebarOpen(false);
  };

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hash listener

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
      setActiveHash("");
    } else {
      setActiveHash("");
    }

    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [sidebarOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" && activeHash === "";
    }
    if (href.startsWith("#")) {
      return activeHash === href;
    }
    return pathname === href;
  };
  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      if (pathname !== "/") {
        router.push("/" + path);
      } else {
        const el = document.querySelector(path);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        window.location.hash = path;
      }
    } else {
      router.push(path);

      setActiveHash("");
      window.location.hash = "";
    }
    setSidebarOpen(false);
  };

  const profileLink =
    currentUser?.role === "TECHNICIAN"
      ? "/chat"
      : currentUser?.role === "USER"
        ? "/shop-owner/dashboard"
        : currentUser?.role === "ADMIN"
          ? "/admin/dashboard"
          : "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
          : "bg-[#f7f9fb]"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[120px]">
            <div className="shrink-0 transition-transform duration-200 hover:scale-105">
              <Image
                src="/r_logo.png"
                alt="Logo"
                width={140}
                height={140}
                className="object-contain w-24 md:w-38 h-38 rounded-2xl"
              />
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(item.href)}
                  className={`py-2 px-5 rounded-full text-md font-medium transition-all duration-200 active:scale-95 ${isActive(item.href)
                    ? "underline underline-offset-4 decoration-2 text-black font-semibold"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                    }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <div
                  ref={profileRef}
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
                    {currentUser?.profileImage ? (
                      <Image
                        src={currentUser.profileImage}
                        alt={currentUser.userName}
                        width={60}
                        height={60}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-green-600 text-sm font-semibold">
                        {currentUser.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  <div
                    className={`absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 transform transition-all duration-200 origin-top-right ${profileOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                      }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>
                    <ul>
                      <li>
                        <Link
                          href={profileLink}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition rounded-t-none"
                          onClick={() => setProfileOpen(false)}
                        >
                          {currentUser?.role === "TECHNICIAN"
                            ? "Go to Technician Chat"
                            : currentUser?.role === "USER"
                              ? "Go to Shop Dashboard"
                              : currentUser?.role === "ADMIN"
                                ? "Go to Admin Dashboard"
                                : ""}
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition rounded-b-xl"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="secondary"
                      className="text-gray-700 py-6 hover:text-black font-medium"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="gap-1.5 py-6 px-5 font-medium">
                      Get started <ArrowUpRight size={16} strokeWidth={2.5} />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={22} className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      <div className="h-16" />

      {/* ─── Mobile Sidebar Overlay ─── */}

      <div
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 z-60 h-full w-[80vw] max-w-xs bg-[#f7f9fb] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out lg:hidden ${sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#f7f9fb]">
          <Image
            src="/r_logo.png"
            alt="Logo"
            width={72}
            height={72}
            className="object-contain"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-black/10 rounded-xl transition-all duration-200 active:scale-95"
            aria-label="Close menu"
          >
            <X size={22} className="text-gray-700" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleNavigation(item.href)}
              className={`w-full text-left py-2 px-4 rounded-2xl text-base font-medium transition-all duration-200 active:scale-[0.98] border ${isActive(item.href)
                ? "bg-primary text-white shadow-sm"
                : "bg-white/50 hover:bg-white border-[#042055] text-gray-700"
                }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer: Auth Actions */}
        <div className="px-5 pb-8 pt-4 border-t border-[#e8dfc8] space-y-3">
          {currentUser ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-1 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 shrink-0">
                  {currentUser?.profileImage ? (
                    <Image
                      src={currentUser.profileImage}
                      alt={currentUser.userName}
                      width={30}
                      height={30}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-green-600 font-semibold">
                      {currentUser.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <Link
                href={profileLink}
                onClick={() => setSidebarOpen(false)}
                className="block w-full text-center py-2 rounded-2xl bg-white border border-[#042055] text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                {currentUser?.role === "TECHNICIAN"
                  ? "Go to Technician Chat"
                  : currentUser?.role === "USER"
                    ? "Go to Shop Dashboard"
                    : currentUser?.role === "ADMIN"
                      ? "Go to Admin Dashboard"
                      : ""}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-2xl bg-red-50 border border-red-200 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setSidebarOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full py-5 text-base border-[#042055] bg-white hover:bg-gray-50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setSidebarOpen(false)}>
                <Button className="w-full gap-2 py-5 text-base font-semibold bg-[#042055] hover:bg-[#03173d] text-white">
                  Get started <ArrowUpRight size={18} strokeWidth={2.5} />
                </Button>
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
