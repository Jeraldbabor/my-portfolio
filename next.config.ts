import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    // Disable webpack cache in dev so refresh always shows latest changes
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
