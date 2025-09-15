import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable polling in dev when running in Docker on Windows/macOS filesystems
  // to improve HMR reliability.
  webpackDevMiddleware: (config) => {
    const usePolling = process.env.WATCHPACK_POLLING === 'true' || process.env.NEXT_WEBPACK_USEPOLLING === '1';
    if (usePolling) {
      // @ts-ignore - watchOptions exists on dev middleware config
      config.watchOptions = {
        // 1s polling interval, small aggregate debounce
        poll: Number(process.env.WATCHPACK_POLLING_INTERVAL || 1000),
        aggregateTimeout: 300,
      } as any;
    }
    return config;
  },
};

export default nextConfig;
