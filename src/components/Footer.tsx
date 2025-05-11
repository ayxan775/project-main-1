import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
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
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-400">Products</Link></li>
              <li><Link href="/distribution" className="hover:text-blue-400">Distribution</Link></li>
              <li><Link href="/career" className="hover:text-blue-400">Career</Link></li>
              <li><Link href="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
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
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2025 AzPort Supply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}