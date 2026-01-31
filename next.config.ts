import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Image optimization for Render deployment
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/devconnect/**',
      },
    ],
  },

  // Turbopack configuration
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
