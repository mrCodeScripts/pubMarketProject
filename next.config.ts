import type { NextConfig } from "next";
import { ENV } from "@/lib/constants";

const nextConfig: NextConfig = {
  /* config options here */
  enablePrerenderSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: ENV.CONFIG_SUPABASE_PURE_PROJECT_URL!,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    webpackMemoryOptimizations: true,
    // preloadEntriesOnStart: false,
  },
};

export default nextConfig;
