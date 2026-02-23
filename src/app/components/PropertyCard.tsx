import { Property } from '@/app/types';
import { MessageCircle, Calendar, User, Building2, Bed, Bath, Square, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  showOwnerInfo?: boolean;
  inChat?: boolean;
  onChatWithOwner?: (property: Property) => void;
  onScheduleViewing?: (property: Property) => void;
  onSelect?: (property: Property) => void;
  onClick?: () => void;
}

export default function PropertyCard({
  property,
  showOwnerInfo = false,
  inChat = false,
  onChatWithOwner,
  onScheduleViewing,
  onSelect,
  onClick
}: PropertyCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking a link, button, or role="button" inside the card, don't trigger the card's click action
    if ((e.target as HTMLElement).closest('a') || 
        (e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }

    if (onSelect && inChat) {
      onSelect(property);
      return;
    }
    if (property.url) {
      window.open(property.url, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  const getSourceLabel = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (inChat) {
    return (
      <div
        className="w-[280px] bg-white rounded-[24px] border border-[#f0effb] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] transition-all cursor-pointer overflow-hidden group"
        onClick={handleCardClick}
      >
        <div className="h-[160px] relative overflow-hidden">
          <ImageWithFallback
            src={property.images?.[0] || ''}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.popular && (
              <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-bold text-[#7065f0] uppercase tracking-wider">Popular</span>
              </div>
            )}
            {property.featured && (
              <div className="bg-[#2E7D32]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Featured</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] truncate text-[#110229] mb-1">
            {property.title}
          </h3>
          <p className="text-[12px] text-[#8f90a6] truncate font-['Plus_Jakarta_Sans:Medium',sans-serif] mb-4">
            {property.address}
          </p>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[22px] text-[#7065f0] tracking-tight">
              ${property.price.toLocaleString()}
            </span>
            {property.priceType === 'month' && (
              <span className="text-[12px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">/month</span>
            )}
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#f0effb] mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-[#7065f0]" />
              <span className="text-[12px] font-bold text-[#110229]">{property.beds}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-[#7065f0]" />
              <span className="text-[12px] font-bold text-[#110229]">{property.baths}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-[#7065f0]" />
              <span className="text-[12px] font-bold text-[#110229]">{property.size}</span>
            </div>
          </div>

          {property.url && (
            <a
              href={property.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 mb-4 text-[11px] font-bold text-[#8f90a6] hover:text-[#7065f0] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{getSourceLabel(property.url)}</span>
            </a>
          )}

          {showOwnerInfo && (
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                if (property.url) window.open(property.url, '_blank', 'noopener,noreferrer');
              }}
              className="mb-4 p-3 bg-[#f7f7fd] rounded-xl flex items-center justify-between hover:bg-[#efeffd] transition-all cursor-pointer group/owner"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {property.owner.type === 'individual' ?
                    <User className="w-3 h-3 text-[#7065f0]" /> :
                    <Building2 className="w-3 h-3 text-[#7065f0]" />
                  }
                </div>
                <p className="text-[11px] font-bold text-[#110229] truncate max-w-[100px]">
                  {property.owner.name}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#7065f0]/10 text-[#7065f0]">
                {property.owner.tier}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {onChatWithOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChatWithOwner(property);
                }}
                className="w-full bg-[#7065f0] text-white rounded-xl py-3 px-4 text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#5048c7] transition-all shadow-md shadow-purple-100"
              >
                <MessageCircle className="w-4 h-4" />
                Connect
              </button>
            )}

            {onScheduleViewing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleViewing(property);
                }}
                className="w-full bg-white border border-[#7065f0] text-[#7065f0] rounded-xl py-3 px-4 text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#f0effb] transition-all"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-[32px] border border-[#f0effb] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all cursor-pointer overflow-hidden p-0 group"
      onClick={handleCardClick}
    >
      <div className="h-[240px] relative overflow-hidden">
        <ImageWithFallback
          src={property.images?.[0] || ''}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.popular && (
            <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-md">
              <span className="text-[11px] font-bold text-[#7065f0] uppercase tracking-widest">Popular</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-8">
        <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[22px] text-[#110229] mb-2">{property.title}</h3>
        <p className="text-[15px] text-[#8f90a6] mb-6 font-['Plus_Jakarta_Sans:Medium',sans-serif]">{property.address}</p>

        <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f0effb]">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-[#7065f0]" />
            <span className="text-[16px] font-bold text-[#110229]">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-[#7065f0]" />
            <span className="text-[16px] font-bold text-[#110229]">{property.baths}</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5 text-[#7065f0]" />
            <span className="text-[16px] font-bold text-[#110229]">{property.size}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold text-[32px] text-[#7065f0] tracking-tight">
              ${property.price.toLocaleString()}
            </span>
            {property.priceType === 'month' && (
              <span className="text-[16px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">/month</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}