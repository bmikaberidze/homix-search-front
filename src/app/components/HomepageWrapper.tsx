import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bed, Bath, Maximize2, Zap, ArrowRight } from 'lucide-react';
import { sampleProperties } from '@/app/data';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useApp } from '@/app/context/AppContext';

export default function HomepageWrapper() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('გამარჯობა, ბინას ვეძებ თბილისში, დღეში 100 ლარად, აივნით!');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/chat?q=' + encodeURIComponent(searchQuery));
    }
  };

  const featuredProperties = sampleProperties.filter((p: any) => p.featured).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <div className="max-w-[1200px] mx-auto px-8 py-24 flex-grow relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-10 right-0 w-64 h-64 bg-[#7065f0]/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#7065f0]/5 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-16 max-w-[900px] mx-auto">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[72px] leading-[1.1] text-[#110229] mb-6 tracking-[-3px]">
            The Fastest way to <br />
            <span className="text-[#7065f0]">sell, buy or rent property</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[22px] text-[#8f90a6] mb-12 max-w-[700px] mx-auto leading-relaxed">
            AI-powered real estate marketplace connecting you directly with owners. Skip the middleman, find your home faster.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-[760px] mx-auto relative group">
            <div className="absolute inset-0 bg-[#7065f0]/10 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for? (e.g., '2 bedroom apartment in New York')"
              className="relative w-full h-[84px] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[18px] text-[#110229] placeholder:text-[#8f90a6] bg-white border-[2px] border-[#f0effb] rounded-full px-10 pr-20 focus:border-[#7065f0] focus:outline-none transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] focus:shadow-[0_20px_50px_-15px_rgba(112,101,240,0.15)]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-[#7065f0] rounded-full flex items-center justify-center hover:bg-[#5048c7] transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div className="flex gap-4 justify-center mt-12 flex-wrap">
            <button
              onClick={() => navigate('/chat?q=' + encodeURIComponent('გამარჯობა, გთხოვთ დამეხმაროთ ბინის შეძენაში!'))}
              className="bg-[#e7e6f9] text-[#7065f0] rounded-full px-8 py-4 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#d5d4f5] border border-[#d5d4f5] transition-all uppercase tracking-wide flex items-center gap-2"
            >
              <span className="text-xl">🏠</span> Buy Property
            </button>
            <button
              onClick={() => toast.error('Sell Property is not available yet.')}
              className="bg-[#e1f1e3] text-[#2E7D32] rounded-full px-8 py-4 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#d2ead5] border border-[#d2ead5] transition-all uppercase tracking-wide flex items-center gap-2"
            >
              <span className="text-xl">💰</span> Sell Property
            </button>
            <button
              onClick={() => navigate('/chat?q=' + encodeURIComponent('გამარჯობა, მინდა დავიქირავო ბინა, გთხოვთ დამეხმაროთ!'))}
              className="bg-[#f3e9cc] text-[#D97706] rounded-full px-8 py-4 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] hover:bg-[#ece0ba] border border-[#ece0ba] transition-all uppercase tracking-wide flex items-center gap-2"
            >
              <span className="text-xl">🔑</span> Rent Property
            </button>
          </div>
        </div>

        {/* Featured Properties Grid */}
        <div className="mt-24">
          <div className="flex justify-between items-end mb-12">
            <div className="text-left">
              <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[40px] text-[#110229] tracking-tight">
                Featured properties
              </h2>
              <p className="text-[#8f90a6] text-[16px] mt-2 font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                Hand-picked properties from our verified owners
              </p>
            </div>
            <button className="text-[#7065f0] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[15px] hover:underline flex items-center gap-1 uppercase tracking-wide">
              Browse All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white border border-[#f0effb] rounded-[24px] overflow-hidden hover:border-[#7065f0] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] group"
              >
                {/* Property Image */}
                <div
                  className="h-[240px] relative overflow-hidden cursor-pointer"
                  onClick={() => toast.error('Property details page is not available yet.')}
                >
                  <ImageWithFallback
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {property.popular && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                      <span className="text-[11px] font-extrabold text-[#7065f0] uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-[#7065f0]" /> Popular
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8f90a6] hover:text-[#7065f0] transition-colors shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[20px] text-[#110229] leading-tight">
                      {property.title}
                    </h3>
                  </div>
                  <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#8f90a6] mb-4">
                    {property.address}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[28px] text-[#7065f0]">
                      ${property.price.toLocaleString()}
                    </span>
                    {property.priceType === 'month' && <span className="text-[15px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[#8f90a6]">/month</span>}
                  </div>

                  <footer className="flex justify-between items-center pt-5 border-t border-[#f0effb] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                    <div className="flex gap-4 text-[13px] text-[#8f90a6]">
                      <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#7065f0]" /> {property.beds}</span>
                      <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#7065f0]" /> {property.baths}</span>
                    </div>
                    <span className="text-[13px] text-[#8f90a6] font-bold">{property.size}</span>
                  </footer>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/chat', { state: { ownerProperty: property } });
                    }}
                    className="w-full mt-6 rounded-xl hover:translate-y-[-2px] transition-transform shadow-sm hover:shadow-purple-200"
                  >
                    Chat with Owner
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 relative overflow-hidden bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[32px] p-16 text-center shadow-2xl shadow-purple-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative z-10 max-w-[700px] mx-auto">
            <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[52px] text-white mb-6 tracking-[-2px] leading-tight">
              Ready to find your <br />dream property?
            </h2>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-white/80 mb-10 leading-relaxed">
              Start a natural conversation with our AI assistant and discover the perfect place to call home today.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-white text-[#7065f0] hover:bg-[#f0effb] rounded-xl px-12 py-5 font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              Start Chatting Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
