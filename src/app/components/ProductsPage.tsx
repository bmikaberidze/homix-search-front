import { Page } from '@/app/types';
import { Button } from './ui/button';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import Footer from './Footer';
import { Building2, Users, Briefcase, Check, ArrowRight } from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (page: Page) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

const products = [
  {
    id: 'individual',
    icon: Users,
    title: 'For Individuals',
    subtitle: 'Buy, Rent, or Sell Your Dream Home',
    description: 'Perfect for home buyers, renters, and individual property owners looking for a seamless real estate experience.',
    color: '#7065f0',
    bgColor: '#f0effb',
    features: [
      'AI-powered property search',
      'Direct messaging with property owners',
      'Virtual property tours',
      'Schedule viewings instantly',
      'Save favorite properties',
      'Price alerts and notifications'
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'developer',
    icon: Building2,
    title: 'For Developers',
    subtitle: 'Showcase Your Projects at Scale',
    description: 'Built for developers managing multiple properties and large-scale projects with advanced portfolio management.',
    color: '#10b981',
    bgColor: '#d1fae5',
    features: [
      'Project portfolio management',
      'Bulk property listings',
      'Advanced analytics dashboard',
      'Lead generation tools',
      'Custom branding options',
      'Integration with CRM systems'
    ],
    cta: 'Schedule Demo',
  },
  {
    id: 'agency',
    icon: Briefcase,
    title: 'For Agencies',
    subtitle: 'Empower Your Real Estate Business',
    description: 'Comprehensive tools for real estate agencies and brokers to manage listings, clients, and grow their business.',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    features: [
      'Team collaboration tools',
      'Client relationship management',
      'Commission tracking',
      'Marketing automation',
      'Performance analytics',
      'Multiple agent accounts'
    ],
    cta: 'Start Free Trial',
  },
];

export default function ProductsPage({ onNavigate, currentUser, onOpenAuth, onSignOut }: ProductsPageProps) {
  const handleCTA = (productId: string) => {
    if (!currentUser) {
      onOpenAuth('signup');
    } else {
      onNavigate('pricing');
    }
  };

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
            <button onClick={() => onNavigate('products')} className="text-[#7065f0]">Products</button>
            <button onClick={() => onNavigate('features')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Features</button>
            <button onClick={() => onNavigate('pricing')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Pricing</button>
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
        <div className="text-center mb-20 max-w-[800px] mx-auto">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[64px] text-[#110229] mb-6 tracking-[-3px] leading-[1.1]">
            Tailored Solutions for <br /><span className="text-[#7065f0]">Every Real Estate Need</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-[#8f90a6] leading-relaxed">
            From individual buyers to large-scale developers, Homix.ai provides the tools and connections to accelerate your real estate journey.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#f0effb] rounded-[32px] p-10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:border-[#7065f0] flex flex-col group"
            >
              <div
                className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${product.color}15` }}
              >
                <product.icon className="w-10 h-10" style={{ color: product.color }} />
              </div>
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[28px] text-[#110229] mb-4">
                {product.title}
              </h2>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] mb-8 leading-relaxed">
                {product.description}
              </p>

              <ul className="space-y-4 mb-10 flex-grow">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${product.color}10` }}>
                      <Check className="w-3 h-3" style={{ color: product.color }} />
                    </div>
                    <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-[#110229]/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleCTA(product.id)}
                className="w-full h-[60px] rounded-2xl text-[16px] font-bold uppercase tracking-wide transition-all group/btn"
                style={{ backgroundColor: product.color }}
              >
                <span>{product.cta}</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom CTA Row */}
        <div className="bg-[#110229] rounded-[40px] p-16 flex flex-col items-center text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#7065f0]/10 rounded-full blur-3xl -ml-48 -mt-48" />
          <div className="relative z-10">
            <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[48px] mb-6 tracking-tight">
              Ready to revolutionize your portfolio?
            </h2>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[20px] text-white/70 mb-12 max-w-[700px] mx-auto leading-relaxed">
              Our AI-powered assistant can help you find the perfect solution for your needs.
            </p>
            <button
              onClick={() => onNavigate('conversation')}
              className="bg-white text-[#7065f0] hover:bg-[#f0effb] px-12 py-5 rounded-xl font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide"
            >
              Talk to AI Assistant
            </button>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}