import { Property } from '@/app/types';
import { MessageCircle, Calendar, User, Building2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  showOwnerInfo?: boolean;
  inChat?: boolean;
  onChatWithOwner?: (property: Property) => void;
  onScheduleViewing?: (property: Property) => void;
  onClick?: () => void;
}

export default function PropertyCard({
  property,
  showOwnerInfo = false,
  inChat = false,
  onChatWithOwner,
  onScheduleViewing,
  onClick
}: PropertyCardProps) {
  // Determine click behavior: external URL vs internal navigation
  const handleCardClick = () => {
    if (property.url) {
      // External listing - open in new tab
      window.open(property.url, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      // Internal property - call onClick handler
      onClick();
    }
  };

  // Compact chat version
  if (inChat) {
    return (
      <div className="w-[280px] bg-white rounded-[8px] border-[1.5px] border-[#f0effb] hover:border-[#7065f0] transition-colors cursor-pointer" onClick={handleCardClick}>
        {/* Property Image - Featured Image */}
        <div className="h-[140px] rounded-t-[8px] relative overflow-hidden">
          <ImageWithFallback 
            src={property.images?.[0] || ''} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.popular && (
            <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-[4px]">
              <span className="text-[10px] font-bold text-[#7065f0] uppercase">Popular</span>
            </div>
          )}
          {property.featured && (
            <div className="absolute top-2 right-2 bg-[#2E7D32] px-2 py-1 rounded-[4px]">
              <span className="text-[10px] font-bold text-white uppercase">Featured</span>
            </div>
          )}
        </div>
        
        {/* Property Details */}
        <div className="p-[12px]">
          <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[14px] truncate text-[#110229]">{property.title}</h3>
          <p className="text-[11px] text-[#8f90a6] truncate font-['Plus_Jakarta_Sans:Medium',sans-serif] mt-1">{property.address}</p>
          
          <p className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[18px] text-[#7065f0] mt-2">
            ${property.price.toLocaleString()}{property.priceType === 'month' ? '/month' : ''}
          </p>
          
          {/* Features */}
          <div className="flex gap-2 text-[11px] text-[#8f90a6] mt-2 pb-2 border-b border-[#f0effb] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
            <span>{property.beds} Beds</span>
            <span>•</span>
            <span>{property.baths} Baths</span>
            <span>•</span>
            <span>{property.size}</span>
          </div>
          
          {/* Owner Info */}
          {showOwnerInfo && (
            <div className="mt-2 p-2 bg-[#fafaff] rounded-[6px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {property.owner.type === 'individual' ? 
                    <User className="w-3 h-3 text-[#7065f0]" /> : 
                    <Building2 className="w-3 h-3 text-[#7065f0]" />
                  }
                  <p className="text-[11px] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold truncate text-[#110229]">
                    {property.owner.name}
                  </p>
                </div>
                <span className="px-1.5 py-0.5 rounded-[3px] text-[8px] font-bold uppercase bg-blue-100 text-blue-700">
                  {property.owner.tier}
                </span>
              </div>
            </div>
          )}
          
          {/* CONTEXT-AWARE ACTIONS */}
          <div className="flex flex-col gap-1.5 mt-3">
            {/* General AI Chat: Show "Chat with Agent" */}
            {onChatWithOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChatWithOwner(property);
                }}
                className="w-full bg-[#7065f0] text-white rounded-[6px] py-2 px-3 text-[12px] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold flex items-center justify-center gap-1.5 hover:bg-[#5048c7] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat with {property.owner.type === 'individual' ? 'Owner' : 'Agent'}
              </button>
            )}
            
            {/* Owner Chat: Show "Schedule Visit" */}
            {onScheduleViewing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleViewing(property);
                }}
                className="w-full bg-[#7065f0] text-white rounded-[6px] py-2 px-3 text-[12px] font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold flex items-center justify-center gap-1.5 hover:bg-[#5048c7] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Visit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Full homepage version - simplified placeholder
  return (
    <div className="bg-white rounded-[12px] border-[1.5px] border-[#f0effb] hover:border-[#7065f0] transition-colors cursor-pointer p-4" onClick={handleCardClick}>
      <div className="h-[200px] bg-gradient-to-br from-[#7065f0] to-[#5048c7] rounded-[8px] mb-4" />
      <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[18px] text-[#110229]">{property.title}</h3>
      <p className="text-[14px] text-[#8f90a6] mt-1 font-['Plus_Jakarta_Sans:Medium',sans-serif]">{property.address}</p>
      <p className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[24px] text-[#7065f0] mt-3">
        ${property.price.toLocaleString()}{property.priceType === 'month' ? '/month' : ''}
      </p>
      <div className="flex gap-3 text-[14px] text-[#8f90a6] mt-3 font-['Plus_Jakarta_Sans:Medium',sans-serif]">
        <span>{property.beds} Beds</span>
        <span>•</span>
        <span>{property.baths} Baths</span>
        <span>•</span>
        <span>{property.size}</span>
      </div>
    </div>
  );
}