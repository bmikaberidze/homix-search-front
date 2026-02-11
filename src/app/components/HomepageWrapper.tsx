import { useState } from 'react';
import { Page } from '@/app/types';
import { Search, Bed, Bath, Maximize2 } from 'lucide-react';
import { sampleProperties } from '@/app/data';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import { Button } from './ui/button';
import Footer from './Footer';

interface HomepageWrapperProps {
  onNavigate: (page: Page, query?: string, property?: any) => void;
  onViewProperty?: (propertyId: string) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export default function HomepageWrapper({ onNavigate, onViewProperty, currentUser, onOpenAuth, onSignOut }: HomepageWrapperProps) {
  const [searchQuery, setSearchQuery] = useState('გამარჯობა, გთხოვ მომიძებნო ბინა თბილისში, ერთი დღით 100 ლარად, აივნით!');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('conversation', searchQuery);  
    }
  };

  const featuredProperties = sampleProperties.filter((p: any) => p.featured).slice(0, 3);

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
            <button onClick={() => onNavigate('products')} className="text-[#110229] hover:text-[#7065f0] transition-colors">Products</button>
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
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-[1200px] mx-auto px-8 py-16 flex-grow">
        <div className="text-center mb-12">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[64px] text-[#110229] mb-4 tracking-[-2px]">
            The Fastest way to <span className="text-[#7065f0]">sell, buy or rent property</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-[#8f90a6] mb-8">
            AI-powered real estate marketplace connecting you directly with owners
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-[700px] mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for? (e.g., '2 bedroom apartment in New York')"
              className="w-full h-[70px] font-['Darker_Grotesque:Medium',sans-serif] font-medium text-[18px] text-[#110229] placeholder:text-[#8f90a6] bg-white border-[1.5px] border-[#f0effb] rounded-[12px] px-6 pr-16 focus:border-[#7065f0] focus:outline-none transition-colors shadow-lg"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[46px] h-[46px] bg-[#7065f0] rounded-full flex items-center justify-center hover:bg-[#5048c7] transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <button
              onClick={() => onNavigate('conversation', 'I want to buy property')}
              className="bg-[#f0effb] border-[1.5px] border-[#f0effb] text-[#7065f0] rounded-[8px] px-6 py-3 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:border-[#7065f0] transition-colors uppercase"
            >
              🏠 Buy Property
            </button>
            <button
              onClick={() => onNavigate('conversation', 'I want to sell property')}
              className="bg-[#E8F5E9] border-[1.5px] border-[#E8F5E9] text-[#2E7D32] rounded-[8px] px-6 py-3 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:border-[#2E7D32] transition-colors uppercase"
            >
              💰 Sell Property
            </button>
            <button
              onClick={() => onNavigate('conversation', 'I want to rent property')}
              className="bg-[#FEF3C7] border-[1.5px] border-[#FEF3C7] text-[#D97706] rounded-[8px] px-6 py-3 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:border-[#D97706] transition-colors uppercase"
            >
              🔑 Rent Property
            </button>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="mt-20">
          <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[44px] text-[#110229] mb-8 text-center tracking-[-1.32px]">
            Featured properties
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <div 
                key={property.id}
                className="bg-white border-[1.5px] border-[#f0effb] rounded-[12px] overflow-hidden hover:border-[#7065f0] transition-all hover:shadow-lg"
              >
                {/* Property Image */}
                <div 
                  className="h-[200px] relative overflow-hidden cursor-pointer"
                  onClick={() => onViewProperty ? onViewProperty(property.id) : onNavigate('conversation', `Tell me about ${property.title}`)}
                >
                  <ImageWithFallback
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {property.popular && (
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-[4px]">
                      <span className="text-[10px] font-bold text-[#7065f0] uppercase">★ Popular</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">
                    {property.title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6] mt-1">
                    {property.address}
                  </p>
                  
                  <p className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[24px] text-[#7065f0] mt-3">
                    ${property.price.toLocaleString()}
                    {property.priceType === 'month' && <span className="text-[16px] opacity-70">/month</span>}
                  </p>
                  
                  <div className="flex gap-3 text-[14px] text-[#8f90a6] mt-3 pt-3 border-t border-[#f0effb] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                    <span>{property.beds} Beds</span>
                    <span>•</span>
                    <span>{property.baths} Baths</span>
                    <span>•</span>
                    <span>{property.size}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('conversation', '', property);
                    }}
                    className="w-full mt-4 bg-[#7065f0] text-white rounded-[8px] px-4 py-3 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#5048c7] transition-colors"
                  >
                    Chat with Owner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[24px] p-12 text-center">
          <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[48px] text-white mb-4 tracking-[-1.44px]">
            Ready to find your dream property?
          </h2>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-white/90 mb-8">
            Start chatting with our AI assistant now
          </p>
          <button
            onClick={() => onNavigate('conversation')}
            className="bg-white text-[#7065f0] rounded-[8px] px-8 py-4 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] hover:bg-[#f0effb] transition-colors uppercase"
          >
            Start Searching
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}