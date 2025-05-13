import { GetServerSideProps } from 'next';

const BASE_URL = 'https://azportsupply.com'; // Replace with your actual domain

// Define your public pages
const PUBLIC_PAGES = [
  '/',
  '/products',
  '/distribution',
  '/career',
  '/about',
  '/contact',
  '/certifications',
  '/testing',
];

// Define your locales as configured in next.config.mjs
const LOCALES = ['en', 'az', 'ru'];
const DEFAULT_LOCALE = 'en';

const createSitemap = (pages: string[], locales: string[], defaultLocale: string) => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  sitemap += `  xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  pages.forEach((page) => {
    // Add default locale URL (e.g., /en/about or /about if it's the default)
    // Next.js handles default locale prefixing based on your config.
    // For simplicity, we'll assume paths in PUBLIC_PAGES don't include the default locale prefix
    // unless your routing explicitly requires it.

    // Entry for the page itself (often resolves to default locale or a non-prefixed version)
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${BASE_URL}${page === '/' ? '' : page}</loc>\n`; // Handle homepage path
    sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`; // Use current date as lastmod
    sitemap += `    <changefreq>daily</changefreq>\n`;
    sitemap += `    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n`;

    // Add xhtml:link for alternate languages
    locales.forEach((locale) => {
      const localePrefix = locale === defaultLocale ? '' : `/${locale}`;
      const alternateUrl = `${BASE_URL}${localePrefix}${page === '/' && locale === defaultLocale ? '' : page}`;
      sitemap += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${alternateUrl}" />\n`;
    });
    sitemap += `  </url>\n`;

    // If you have distinct URLs for each locale (e.g. /en/about, /az/about)
    // and want them as separate entries in the sitemap (in addition to xhtml:link)
    // you might iterate through locales here to create separate <url> entries.
    // However, xhtml:link is the primary way to declare alternates.
    // For this example, we'll stick to one <url> entry per page with xhtml:link alternates.
  });

  sitemap += `</urlset>\n`;
  return sitemap;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = createSitemap(PUBLIC_PAGES, LOCALES, DEFAULT_LOCALE);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

// Default export to prevent Next.js errors, this page doesn't render anything visible
export default function Sitemap() {
  return null;
}