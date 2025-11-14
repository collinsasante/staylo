/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // For Cloudinary images
    unoptimized: false,
  },
  // Cloudflare Pages compatibility
  output: 'standalone',
};

export default nextConfig;
