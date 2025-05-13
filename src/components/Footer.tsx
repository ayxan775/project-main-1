import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

export function Footer() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az : locale === 'ru' ? ru : en; // Select translations

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t.footer.contactHeading}</h3> {/* Use translation */}
            <div className="space-y-3">
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                +994 12 311 14 18
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Sales@azportsupply.com
              </p>
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Chinar Park Business Center, Baku
              </p>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t.footer.quickLinksHeading}</h3> {/* Use translation */}
            <ul className="space-y-2">
              {/* Reuse header translations */}
              <li><Link href="/" className="hover:text-blue-400">{t.header.navHome}</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">{t.header.navProducts}</Link></li>
              <li><Link href="/distribution" className="hover:text-blue-400">{t.header.navDistribution}</Link></li>
              <li><Link href="/career" className="hover:text-blue-400">{t.header.navCareer}</Link></li>
              <li><Link href="/about" className="hover:text-blue-400">{t.header.navAbout}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">{t.header.contactUs}</Link></li>
            </ul>
          </div>
          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">{t.footer.followUsHeading}</h3> {/* Use translation */}
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61575970508290"
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/azport.supply/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.linkedin.com/company/azport-supply/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>{t.footer.copyright}</p> {/* Use translation */}
        </div>
      </div>
    </footer>
  );
}