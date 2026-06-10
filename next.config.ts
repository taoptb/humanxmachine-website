// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'files.notion.so',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
    ],
  },
}

export default nextConfig
