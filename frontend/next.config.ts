import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your Supabase project domain here
    // Example: ['abcdefgh.supabase.co']
    domains: process.env.NEXT_PUBLIC_SUPABASE_URL
      ? [new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname]
      : [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
