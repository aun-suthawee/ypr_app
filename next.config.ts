import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  async rewrites() {
    // In development, proxy API calls to the backend to avoid CORS and hardcoded URLs
    if (isDev) {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
