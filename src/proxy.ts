import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

interface IUser {
  id: string;
  email: string;
  role: string;
}

const roleBasedRoutes = ["/", "/admin/dashboard", "/user/dashboard"];

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("accessToken", accessToken, "refreshToken", refreshToken);

  const { pathname } = request.nextUrl;

  if (authRoutes.includes(pathname)) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/about/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
