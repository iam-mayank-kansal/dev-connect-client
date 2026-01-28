import type { NextConfig } from 'next';
import path from 'path'; // Import the path module

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/devconnect/**',
      },
    ],
  },
  // Fix: Move experimental.turbo to turbopack and use an absolute path
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
