import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#110229] text-white border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[28px] mb-6 tracking-tight text-white uppercase">
              HOMIX.AI
            </h3>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 leading-relaxed mb-6">
              The fastest way to sell, buy or rent property. AI-powered real estate marketplace connecting you directly with owners.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#7065f0] border border-white/10 rounded-full flex items-center justify-center transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#7065f0] border border-white/10 rounded-full flex items-center justify-center transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#7065f0] border border-white/10 rounded-full flex items-center justify-center transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-[#7065f0] border border-white/10 rounded-full flex items-center justify-center transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:ml-auto">
            <h4 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[17px] mb-6 text-white">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Search Properties
                </Link>
              </li>
              <li>
                <Link to="/features" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:ml-auto">
            <h4 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[17px] mb-6 text-white">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/contact" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  Mortgage Calc
                </a>
              </li>
              <li>
                <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60 hover:text-white transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:ml-auto">
            <h4 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[17px] mb-6 text-white">
              Solutions
            </h4>
            <ul className="space-y-4">
              <li className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60">
                Individual Buyers
              </li>
              <li className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60">
                Real Estate Brokers
              </li>
              <li className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-white/60">
                Property Developers
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-white/40">
              &copy; {currentYear} Homix.ai. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-white/40 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-white/40 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-white/40 hover:text-white transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
