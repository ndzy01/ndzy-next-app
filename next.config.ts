import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configure pageExtensions to include md and mdx for potential future use
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
