/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'az', 'ru'], // Supported locales
    defaultLocale: 'en', // Default locale
  },
  // Use serverComponentsExternalPackages to tell Next.js which packages
  // should be treated as server-only modules
  experimental: {
    serverComponentsExternalPackages: ['sqlite3', 'sqlite'],
  },
  // Fix Node.js polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client-side
      config.resolve.fallback = {
        fs: false,
        path: false,
        net: false,
        dns: false,
        tls: false,
        child_process: false,
        url: false,
      };
    }
    return config;
  },
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