import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Calendar, TrendingUp, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI-Powered Chat',
    description: 'Conversational AI helps you discover properties that match your preferences through natural dialogue.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Advanced algorithms understand your needs and provide personalized property recommendations instantly.',
  },
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Schedule property visits directly through the platform with instant confirmation from owners.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Updates',
    description: 'Get instant notifications about new listings, price changes, and property availability.',
  },
  {
    icon: Shield,
    title: 'Verified Owners',
    description: 'All property owners are verified to ensure safe and secure transactions for everyone.',
  },
  {
    icon: Zap,
    title: 'Instant Messaging',
    description: 'Connect directly with property owners for fast responses and transparent communication.',
  },
];

export default function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="max-w-[1200px] mx-auto px-8 py-24">
        <div className="text-center mb-20 max-w-[800px] mx-auto">
          <h1 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[64px] text-[#110229] mb-6 tracking-[-3px] leading-[1.1]">
            Powerful Features for <br /><span className="text-[#7065f0]">Modern Real Estate</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[20px] text-[#8f90a6] leading-relaxed">
            Everything you need to find your dream property or connect with serious buyers. Built with cutting-edge AI technology for a seamless experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#f0effb] rounded-[24px] p-10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#7065f0] group"
            >
              <div className="w-16 h-16 bg-[#7065f0]/10 rounded-[16px] flex items-center justify-center mb-8 group-hover:bg-[#7065f0] group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-[#7065f0] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[22px] text-[#110229] mb-4">
                {feature.title}
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[15px] text-[#8f90a6] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-20 mb-32 bg-[#f7f7fd] rounded-[32px] p-16">
          <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[44px] text-[#110229] mb-16 text-center tracking-tight">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#7065f0] rounded-2xl flex items-center justify-center text-white font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] text-[32px] mx-auto mb-8 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-4">
                Start a Conversation
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] leading-relaxed">
                Tell our AI what you're looking for in natural language. No complex filters needed.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#7065f0] rounded-2xl flex items-center justify-center text-white font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] text-[32px] mx-auto mb-8 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-4">
                Discover Properties
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] leading-relaxed">
                Browse personalized recommendations and save your favorites in one place.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#7065f0] rounded-2xl flex items-center justify-center text-white font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] text-[32px] mx-auto mb-8 shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-4">
                Connect with Owners
              </h3>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] leading-relaxed">
                Message owners directly or schedule visits with one click. No middlemen.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white border border-[#f0effb] rounded-[32px] p-12 hover:border-[#7065f0] transition-colors duration-300 shadow-sm">
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[36px] text-[#110229] mb-8 flex items-center gap-3">
                <span className="w-2 h-10 bg-[#7065f0] rounded-full" /> For Property Seekers
              </h2>
              <ul className="space-y-6">
                {[
                  'Find properties faster with AI-powered recommendations',
                  'Connect directly with property owners for better deals',
                  'Schedule visits and get instant responses',
                  'No hidden fees or middleman charges'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-[#7065f0]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#7065f0] text-[12px] font-bold">✓</span>
                    </div>
                    <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229] leading-tight">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#110229] rounded-[32px] p-12 shadow-xl">
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[36px] text-white mb-8 flex items-center gap-3">
                <span className="w-2 h-10 bg-[#7065f0] rounded-full" /> For Property Owners
              </h2>
              <ul className="space-y-6">
                {[
                  'Reach motivated buyers and renters instantly',
                  'Manage all inquiries in one centralized platform',
                  'Save on commission with direct connections',
                  'Get detailed analytics on property performance'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-[12px] font-bold">✓</span>
                    </div>
                    <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-white/80 leading-tight">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-24 text-center bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[32px] p-20 text-white shadow-2xl shadow-purple-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[56px] mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[20px] text-white/80 mb-12 max-w-[600px] mx-auto leading-relaxed">
              Join thousands of property owners and seekers who are already using Homix.ai to revolutionize their real estate experience.
            </p>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => navigate('/chat')}
                className="bg-white text-[#7065f0] hover:bg-[#f0effb] px-10 py-5 rounded-xl font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                Start Searching
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="bg-purple-400/20 text-white border border-white/30 hover:bg-purple-400/30 px-10 py-5 rounded-xl font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] transition-all hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
