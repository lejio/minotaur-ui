import type { NextConfig } from "next";

const isGitHubPages = Boolean(process.env.GITHUB_PAGES);

const nextConfig: NextConfig = {
  transpilePackages: ["@minotaur-ui/ui"],
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/minotaur-ui",
        assetPrefix: "/minotaur-ui",
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
};

export default nextConfig;
