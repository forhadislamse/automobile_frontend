/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  ChevronDown,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const adminNavItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Shop & User Management", url: "/admin/shop", icon: Store },
  {
    title: "Subscription & Billing",
    url: "/admin/subscription",
    icon: CreditCard,
  },
];

const userNavItems = [
  { title: "Dashboard", url: "/shop-owner/dashboard", icon: LayoutDashboard },
  {
    title: "Invitations",
    url: "/shop-owner/dashboard/invitations",
    icon: CreditCard,
  },
  {
    title: "Technician Management",
    url: "/shop-owner/dashboard/technician-management",
    icon: CreditCard,
  },
  {
    title: "Billing",
    url: "/shop-owner/dashboard/billing",
    icon: CreditCard,
  },
];

interface AppHeaderProps {
  role: "ADMIN" | "USER" | string;
  user?: any;
  currentPath?: string;
  onResetPassword?: () => void;

  onNavigate?: (url: string) => void;
}

export default function AppHeader({
  role,
  user,
  currentPath,
  onResetPassword,
  onNavigate,
}: AppHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const navItems =
    role === "ADMIN" ? adminNavItems : role === "USER" ? userNavItems : [];

  const [activePath, setActivePath] = useState(currentPath);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (url: string) => {
    router.push(url);
    setActivePath(url);
    onNavigate?.(url);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const safeUser = {
    name: user?.name || "Unknown",
    role: user?.role || "",
    profileImage: user?.profileImage || "",
  };

  const initials = safeUser?.name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-md">
          <Image
            src="/r_logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="size-auto"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center bg-white py-2 px-2 rounded-full gap-1">
          {navItems.map((item) => {
            const active = activePath === item.url;
            return (
              <Button
                key={item.url}
                onClick={() => handleNavigate(item.url)}
                className={cn(
                  "flex items-center gap-5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-[#042055] text-white shadow"
                    : "text-black bg-[#e9f0ff] hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.title}
              </Button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={safeUser.profileImage}
                    alt={safeUser.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-slate-300 text-slate-700 text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-slate-800">
                    {safeUser.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {safeUser.role}
                  </span>
                </div>

                <ChevronDown className="h-4 w-4 text-slate-500 ml-0.5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 mt-1 rounded-xl shadow-lg border border-gray-100"
            >
              <Link
                href={
                  role === "ADMIN"
                    ? "/admin/profile"
                    : "/shop-owner/dashboard/profile"
                }
              >
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-slate-700 rounded-lg">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              {/* FIXED: now using handleLogout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-0">
              <div className="flex items-center gap-2 border-b px-5 py-4">
                <span className="text-base font-semibold text-slate-800">
                  SmartAutoTech
                </span>
              </div>

              <div className="flex items-center gap-3 border-b px-5 py-4 bg-slate-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={safeUser.profileImage}
                    alt={safeUser.name}
                  />
                  <AvatarFallback className="bg-slate-300 text-slate-700 text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {safeUser.name}
                  </p>
                  <p className="text-xs text-slate-500">{safeUser.role}</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1 px-3 py-4">
                {navItems.map((item) => {
                  const active = activePath === item.url;
                  return (
                    <button
                      key={item.url}
                      onClick={() => handleNavigate(item.url)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-left transition-all",
                        active
                          ? "bg-slate-800 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.title}
                    </button>
                  );
                })}
              </nav>

              <div className="absolute bottom-0 left-0 right-0 border-t px-3 py-4 flex flex-col gap-1 bg-white">
                <button
                  onClick={() => {
                    onResetPassword?.();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
