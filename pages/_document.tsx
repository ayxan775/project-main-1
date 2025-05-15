import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AzPort Supply - Your trusted partner in industrial supply chain management and logistics solutions in Azerbaijan" />
        <meta name="keywords" content="industrial supply, logistics, Azerbaijan, hydraulic solutions, Balflex, supply chain" />
        <meta name="author" content="AzPort Supply" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AzPort Supply - Industrial Supply & Logistics" />
        <meta property="og:description" content="Your trusted partner in industrial supply chain management and logistics solutions in Azerbaijan" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://azportsupply.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 