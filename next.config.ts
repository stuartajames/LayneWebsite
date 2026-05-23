import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 's3-ap-southeast-2.amazonaws.com',
        pathname: '/homes-listing-images/**',
      },
      {
        protocol: 'https',
        hostname: 'fastly.ratemyagent.co.nz',
      },
      {
        protocol: 'https',
        hostname: 'static.ratemyagent.co.nz',
      },
    ],
  },
};

export default nextConfig;
