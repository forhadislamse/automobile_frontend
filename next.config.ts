import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
  allowedDevOrigins: ["10.0.30.150", "localhost:3000"],
};

export default nextConfig;
