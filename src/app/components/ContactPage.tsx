import { Page } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import Footer from './Footer';
import { toast } from 'sonner';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export default function ContactPage({ onNavigate, currentUser, onOpenAuth, onSignOut }: ContactPageProps) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f0effb] py-5 px-8">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[28px] text-[#110229] uppercase tracking-[-1px] cursor-pointer hover:text-[#7065f0] transition-colors"
          >
            HOMIX.AI
          </button>
          <nav className="hidden md:flex gap-10 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] tracking-[-0.2px] uppercase">
            <button onClick={() => onNavigate('products')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Products</button>
            <button onClick={() => onNavigate('features')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Features</button>
            <button onClick={() => onNavigate('pricing')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Pricing</button>
          </nav>
          {currentUser ? (
            <UserMenu user={currentUser} onSignOut={onSignOut} onNavigate={onNavigate} />
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => toast.error('Sign In is not available yet.')}
                className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] text-[#110229] hover:text-[#7065f0] transition-colors uppercase"
              >
                Sign In
              </button>
              <Button
                onClick={() => toast.error('Get Started is not available yet. Please use guest mode by searching below.')}
                variant="outline"
                className="bg-[#7065f0] text-white hover:bg-[#5048c7] border-none"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-8 py-16 flex-grow">
        <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[48px] text-[#110229] mb-6">
          Get in Touch
        </h1>
        <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[18px] text-[#8f90a6] mb-12">
          Have questions? We're here to help
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border-[1.5px] border-[#f0effb] rounded-[12px] p-8">
            <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-6">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#110229] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white border-[1.5px] border-[#f0effb] rounded-[8px] px-4 py-3 font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#110229] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-white border-[1.5px] border-[#f0effb] rounded-[8px] px-4 py-3 font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#110229] mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full bg-white border-[1.5px] border-[#f0effb] rounded-[8px] px-4 py-3 font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#7065f0] text-white rounded-[8px] px-6 py-3 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#5048c7] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#f0effb] rounded-[12px] p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#7065f0] rounded-[8px] p-3">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229] mb-1">
                    Email
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#8f90a6]">
                    support@homix.ai
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f0effb] rounded-[12px] p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#7065f0] rounded-[8px] p-3">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229] mb-1">
                    Phone
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#8f90a6]">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f0effb] rounded-[12px] p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#7065f0] rounded-[8px] p-3">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229] mb-1">
                    Office
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[14px] text-[#8f90a6]">
                    123 Tech Street<br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}