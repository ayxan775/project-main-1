/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable SPA mode with static export
  output: 'export',
  // Make sure images are processed correctly
  images: {
    unoptimized: true,
  },
  // Improve SEO by generating static HTML for each page
  trailingSlash: true,
  // Generate a sitemap.xml file
  poweredByHeader: false,
};

export default nextConfig; 