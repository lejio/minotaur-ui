import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@minotaur-ui/ui"],
  output: "standalone",
};

export default nextConfig;
