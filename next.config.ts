import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  // lets a production build run against a separate output directory while the
  // dev server keeps serving from .next
  distDir: process.env.BUILD_DIR || ".next",
};

export default nextConfig;
