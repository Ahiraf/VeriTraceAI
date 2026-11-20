import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@veritrace/types'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
