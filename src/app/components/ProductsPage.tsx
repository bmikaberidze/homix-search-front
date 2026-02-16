import { Page } from '@/app/types';
import { Button } from './ui/button';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import Footer from './Footer';
import { Building2, Users, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';

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
      'Price alerts and notifications',
      'Mortgage calculator',
      'Neighborhood insights',
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'developer',
    icon: Building2,
    title: 'For Real Estate Developers',
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
      'Integration with CRM systems',
      'Multi-project tracking',
      'Investor relations tools',
    ],
    cta: 'Schedule Demo',
  },
  {
    id: 'agency',
    icon: Briefcase,
    title: 'For Agencies & Brokers',
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
      'Multiple agent accounts',
      'Lead distribution system',
      'Branded property pages',
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
      <header className="border-b border-[#f0effb] py-6 px-8">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[44px] text-[#110229] uppercase tracking-[-1.32px] cursor-pointer hover:text-[#7065f0] transition-colors"
          >
            HOMIX.AI
          </button>
          <nav className="flex gap-6 font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[18px] tracking-[-0.54px] uppercase">
            <button onClick={() => onNavigate('products')} className="text-[#7065f0]">Products</button>
            <button onClick={() => onNavigate('features')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Features</button>
            <button onClick={() => onNavigate('pricing')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Pricing</button>
          </nav>
          {currentUser ? (
            <UserMenu user={currentUser} onSignOut={onSignOut} onNavigate={onNavigate} />
          ) : (
            <button
              onClick={() => onNavigate('signin')}
              className="bg-[#7065f0] text-white hover:bg-[#5048c7] rounded-[6px] px-6 py-2 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] uppercase transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#f0effb] to-white py-20 px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[56px] text-[#110229] mb-6 tracking-[-1.5px]">
            Solutions Tailored to <span className="text-[#7065f0]">Your Needs</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[20px] text-[#8f90a6] max-w-[700px] mx-auto">
            Whether you're buying your first home, developing communities, or running an agency, Homix.ai has the perfect solution for you.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1200px] mx-auto px-8 py-16 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-2 border-[#f0effb] rounded-[16px] p-8 hover:shadow-lg transition-all hover:border-[#7065f0]"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-[12px] flex items-center justify-center mb-6"
                style={{ backgroundColor: product.bgColor }}
              >
                <product.icon className="w-8 h-8" style={{ color: product.color }} />
              </div>

              {/* Title */}
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[28px] text-[#110229] mb-2">
                {product.title}
              </h2>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#7065f0] mb-4">
                {product.subtitle}
              </p>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6] mb-6">
                {product.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: product.color }} />
                    <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                onClick={() => handleCTA(product.id)}
                className="w-full h-[48px] text-white hover:opacity-90 transition-all group"
                style={{ backgroundColor: product.color }}
              >
                <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px]">
                  {product.cta}
                </span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[20px] p-12">
          <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[36px] text-white mb-4">
            Not sure which product is right for you?
          </h2>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[18px] text-white/90 mb-8">
            Our AI-powered assistant can help you find the perfect solution for your needs.
          </p>
          <Button
            onClick={() => onNavigate('conversation')}
            // className="bg-white text-[Black] hover:bg-white/90 h-[56px] px-8"
            className="flex gap-4 justify-center"
          >
            <span className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px]">
              Talk to AI Assistant
            </span>
          </Button>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}