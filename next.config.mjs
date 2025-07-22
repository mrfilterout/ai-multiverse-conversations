/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error handling
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // Security headers are handled in vercel.json
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  }
};

export default nextConfig;