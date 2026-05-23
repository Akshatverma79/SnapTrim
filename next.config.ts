import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Webpack config (used by `next build` and `next dev`)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent fs from being bundled in the browser
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};

export default nextConfig;
