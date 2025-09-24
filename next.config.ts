import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure pageExtensions to include md and mdx for potential future use
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  // Static export configuration for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (replace 'ndzy-next-app' with your repo name)
  basePath: '/ndzy-next-app',
  
  // Asset prefix for correct resource loading
  assetPrefix: '/ndzy-next-app/',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better compatibility with static hosting
  trailingSlash: true,
};

export default nextConfig;
