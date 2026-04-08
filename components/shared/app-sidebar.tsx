"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/src/assets/logo2.png";
import {
  HandCoins,
  Home,
  InfoIcon,
  LayoutDashboard,
  Search,
  BookOpen,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    navMain: [
      {
        title: "Dashboard",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Account Management",
        url: "/user/dashboard/profile",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  admin: {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Transactions",
        url: "/admin/transactions",
        icon: HandCoins,
      },
      {
        title: "Subscriptions",
        url: "/admin/subscriptions",
        icon: BookOpen,
      },
      {
        title: "Content",
        url: "#",
        icon: InfoIcon,
        items: [
          {
            title: "Chapters",
            url: "/admin/chapters",
            icon: BookOpen,
          },
          {
            title: "Sections",
            url: "/admin/sections",
            icon: Search,
          },
        ],
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
};

// add roles based on your requirements
interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role?.toLowerCase() as keyof typeof data];

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-white border-r border-blue-200"
      {...props}
    >
      <SidebarHeader className="py-4">
        <Link
          href={"/"}
          className="flex items-center w-full justify-center"
        >
          <Image
            src={Logo.src}
            alt="Logo"
            width={160}
            height={60}
            className="w-auto h-auto max-w-[80%] max-h-16 object-contain"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData?.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
