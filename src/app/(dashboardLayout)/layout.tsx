/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppHeader from "@/components/module/Dashboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetMeQuery } from "@/redux/api/authApi";

import { useAppSelector } from "@/redux/hooks";
import { useDecodedToken } from "@/src/hooks/useDecodedToken";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const token = useAppSelector((state) => state.auth.token);
  const decodedToken = useDecodedToken(token);

  const { data: getMe } = useGetMeQuery({}) as any;
  const userData = getMe?.data;

  console.log(userData);

  const user = userData
    ? {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        profileImage: userData.profileImage,
        role: userData.role,
      }
    : null;

  const role = decodedToken?.role || "ADMIN";
  // const role = "USER";

  return (
    <SidebarProvider>
      {/* Pass the user role dynamically to AppSidebar */}
      {/* <AppSidebar role={role} /> */}
      <SidebarInset>
        <header className="bg-[#f3f5f7] flex h-25 shrink-0  items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <AppHeader role={role} user={user} currentPath={currentPath} />
        </header>
        <div className="p-4 pt-0 bg-[#f3f5f7] min-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
