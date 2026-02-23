import { Property } from '@/app/types';
import { X } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface MiniPropertyCardProps {
  property: Property;
  onRemove: (propertyId: string) => void;
}

export default function MiniPropertyCard({ property, onRemove }: MiniPropertyCardProps) {
  return (
    <div className="flex items-center gap-2 bg-white border border-[#f0effb] rounded-xl px-2 py-1.5 shadow-sm animate-in fade-in zoom-in duration-200">
      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
        <ImageWithFallback
          src={property.images?.[0] || ''}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-[12px] font-bold text-[#110229] truncate max-w-[120px] font-['Plus_Jakarta_Sans:Bold',sans-serif]">
        {property.title}
      </span>
      <button
        onClick={() => onRemove(property.id)}
        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-[#f0effb] transition-colors flex-shrink-0"
      >
        <X className="w-3 h-3 text-[#8f90a6]" />
      </button>
    </div>
  );
}
