/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/register"];

const roleBasedPrivateRoutes = {
  USER: [/^\/shop-owner/],
  TECHNICIAN: [/^\/chat/],
  ADMIN: [/^\/admin/],
};

type Role = keyof typeof roleBasedPrivateRoutes;

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL(`/login?redirectPath=${pathname}`, request.url),
    );
  }

  try {
    const decoded: any = jwtDecode(token);

    const role = decoded?.role as Role;

    if (role && roleBasedPrivateRoutes[role]) {
      if (authRoutes.includes(pathname)) {
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        } else if (role === "USER") {
          return NextResponse.redirect(new URL("/shop-owner/dashboard", request.url));
        } else if (role === "TECHNICIAN") {
          return NextResponse.redirect(new URL("/chat", request.url));
        }
      }

      const routes = roleBasedPrivateRoutes[role];

      if (routes.some((route) => pathname.match(route))) {
        return NextResponse.next();
      }
    }

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/login", "/admin/:path*", "/chat/:path*", "/shop-owner/:path*"],
};
