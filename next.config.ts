import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  reactStrictMode: true,
  reactCompiler: true,
  logging: {
    fetches: { fullUrl: true, hmrRefreshes: true },
    browserToTerminal: true,
  },
  experimental: {
    caseSensitiveRoutes: true,
    viewTransition: true,
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
