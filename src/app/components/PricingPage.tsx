import { useState } from 'react';
import { Page } from '@/app/types';
import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import Footer from './Footer';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup', plan?: string) => void;
  onSignOut: () => void;
}

const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for exploring and small-scale searching.',
    features: [
      'Standard AI property search',
      'Save up to 5 properties',
      'Basic owner messaging',
      'Public listing access'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Broker',
    price: 149,
    description: 'Best for real estate professionals managing listings.',
    features: [
      'Advanced AI matching',
      'Unlimited property saves',
      'Priority owner messaging',
      'Listing performance analytics',
      'Professional CRM tools',
      'Verified broker badge'
    ],
    cta: 'Start 7-Day Free Trial',
    popular: true
  },
  {
    name: 'Developer',
    price: 499,
    description: 'Ideal for large firms and property developers.',
    features: [
      'Custom AI search models',
      'Bulk property management',
      'API access for integration',
      'Dedicated account manager',
      'Advanced market insights',
      'White-label options',
      'Priority support 24/7'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingPage({ onNavigate, currentUser, onOpenAuth, onSignOut }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
            <button onClick={() => onNavigate('pricing')} className="text-[#7065f0]">Pricing</button>
          </nav>
          {currentUser ? (
            <UserMenu user={currentUser} onSignOut={onSignOut} onNavigate={onNavigate} />
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => onOpenAuth('signin')}
                className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] text-[#110229] hover:text-[#7065f0] transition-colors uppercase"
              >
                Sign In
              </button>
              <Button
                onClick={() => onOpenAuth('signup')}
                className="uppercase tracking-wide px-8"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center mb-16 max-w-[800px] mx-auto">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[64px] text-[#110229] mb-6 tracking-[-3px] leading-[1.1]">
            Simple, Transparent <br /><span className="text-[#7065f0]">Pricing for Everyone</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-[#8f90a6] leading-relaxed mb-12">
            Choose the plan that's right for you. Whether you're a first-time home seeker or a seasoned developer, we've got you covered.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-[15px] font-bold ${billingCycle === 'monthly' ? 'text-[#110229]' : 'text-[#8f90a6]'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-[#f0effb] rounded-full p-1 relative transition-colors"
            >
              <div className={`shadow-sm w-6 h-6 bg-[#7065f0] rounded-full transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[15px] font-bold ${billingCycle === 'yearly' ? 'text-[#110229]' : 'text-[#8f90a6]'}`}>Yearly <span className="text-[#2E7D32] text-[12px] bg-[#E8F5E9] px-2 py-0.5 rounded-full ml-1 font-bold">Save 20%</span></span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-[32px] p-10 border transition-all duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col ${tier.popular
                  ? 'border-[#7065f0] bg-white shadow-[0_20px_40px_-15px_rgba(112,101,240,0.15)] ring-1 ring-[#7065f0]/50 scale-105 z-10'
                  : 'border-[#f0effb] bg-white hover:border-[#7065f0]/30'
                }`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7065f0] to-[#5048c7] text-white px-6 py-1.5 rounded-full text-[13px] font-bold uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-4">
                {tier.name}
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-[#8f90a6] mb-8 leading-relaxed">
                {tier.description}
              </p>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[56px] text-[#110229] tracking-tight">
                  ${billingCycle === 'yearly' ? Math.floor(tier.price * 0.8) : tier.price}
                </span>
                <span className="text-[16px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                  /month
                </span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 bg-[#7065f0]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#7065f0] stroke-[3]" />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-[#110229]/80 leading-snug">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? 'default' : 'outline'}
                className={`w-full h-[60px] rounded-2xl text-[16px] font-bold uppercase tracking-wide transition-all ${tier.popular ? 'shadow-xl shadow-purple-200' : ''
                  }`}
                onClick={() => toast.error(`${tier.cta} is not available yet.`)}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-[800px] mx-auto mt-20 mb-32">
          <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[44px] text-[#110229] mb-12 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades will apply at the start of your next billing cycle.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and digital payment methods. Enterprise customers can also arrange for invoicing.'
              },
              {
                q: 'Is there a long-term contract?',
                a: 'No! All plans are month-to-month with no long-term commitment. Cancel anytime with no penalties.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-[#f7f7fd] rounded-[24px] p-8 hover:bg-[#f0effb] transition-colors duration-300">
                <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[20px] text-[#110229] mb-4">
                  {faq.q}
                </h3>
                <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mb-24 text-center bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[32px] p-20 text-white shadow-2xl shadow-purple-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[52px] mb-6 tracking-tight leading-tight">
              Ready to grow your <br />real estate business?
            </h2>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[20px] text-white/80 mb-12 max-w-[600px] mx-auto leading-relaxed">
              Start your free trial today or contact our sales team to discuss custom solutions for your agency.
            </p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => onOpenAuth('signup', 'Broker')}
                className="bg-white text-[#7065f0] hover:bg-[#f0effb] px-12 py-5 rounded-xl font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-purple-400/20 text-white border border-white/30 hover:bg-purple-400/30 px-12 py-5 rounded-xl font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}