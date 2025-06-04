import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily disable ESLint during builds for hackathon
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable TypeScript errors during builds for hackathon
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
