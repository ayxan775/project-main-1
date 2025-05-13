import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Hero } from '../components/Hero';
import { OfficialRepresentative } from '../components/OfficialRepresentative';
import { AboutAzPort } from '../components/AboutAzPort';
import { SafetyStandards } from '../components/SafetyStandards';
import { Advantages } from '../components/Advantages';
import { HomeProducts } from '../components/HomeProducts';
import { Contact } from '../components/Contact';
import { CustomerSatisfaction } from '../components/CustomerSatisfaction';

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

export function Home() {
  const router = useRouter();
  const { locale } = router;

  // Determine translations based on current locale
  const t = locale === 'az' ? az : locale === 'ru' ? ru : en;
  const pageTitle = t.header.logoAlt; // Using the general site title for home
  const pageDescription = t.hero.subtitle;
  const siteUrl = 'https://azportsupply.com'; // Ensure this is your correct domain
  const canonicalUrl = `${siteUrl}${router.asPath}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
      <div className="space-y-8 md:space-y-12">
        <Hero />
        <OfficialRepresentative />
      <HomeProducts />
      <AboutAzPort />
      <SafetyStandards />
      <Advantages />
      <CustomerSatisfaction />
      <Contact />
    </div>
    </>
  );
}