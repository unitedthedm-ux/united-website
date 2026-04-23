import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public bucket URLs  (*.r2.dev)
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        // Cloudflare R2 custom domains if you add one later
        protocol: "https",
        hostname: "**.cloudflarestorage.com",
      },
    ],
  },
};

export default nextConfig;
