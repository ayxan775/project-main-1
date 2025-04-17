import React from 'react';
import { Hero } from '../components/Hero';
import { OfficialRepresentative } from '../components/OfficialRepresentative';
import { AboutAzPort } from '../components/AboutAzPort';
import { SafetyStandards } from '../components/SafetyStandards';
import { Advantages } from '../components/Advantages';
import { Products } from '../components/Products';
import { Contact } from '../components/Contact';

export function Home() {
  return (
    <>
      <Hero />
      <OfficialRepresentative />
      <AboutAzPort />
      <Products />
      <SafetyStandards />
      <Advantages />
      <Contact />
    </>
  );
}