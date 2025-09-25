import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure pageExtensions to include md and mdx for potential future use
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Conditional configuration based on environment
  ...(process.env.NODE_ENV === 'production' ? {
    // Static export configuration for GitHub Pages (production only)
    output: 'export',
    basePath: '/ndzy-next-app',
    assetPrefix: '/ndzy-next-app/',
    trailingSlash: true,
  } : {
    // Development configuration with API routes support
    basePath: '',
    assetPrefix: '',
    trailingSlash: false,
  }),
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
