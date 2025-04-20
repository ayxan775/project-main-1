import React from 'react';
import { Hero } from '../components/Hero';
import { OfficialRepresentative } from '../components/OfficialRepresentative';
import { AboutAzPort } from '../components/AboutAzPort';
import { SafetyStandards } from '../components/SafetyStandards';
import { Advantages } from '../components/Advantages';
import { Products } from '../components/Products';
import { Contact } from '../components/Contact';
import { CustomerSatisfaction } from '../components/CustomerSatisfaction';

export function Home() {
  return (
    <div className="space-y-8 md:space-y-12">
      <Hero />
      <OfficialRepresentative />
      <AboutAzPort />
      <Products />
      <SafetyStandards />
      <Advantages />
      <CustomerSatisfaction />
      <Contact />
    </div>
  );
}