import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
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
  );
}
