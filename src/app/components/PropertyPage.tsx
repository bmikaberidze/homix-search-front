import { useState } from 'react';
import { Page, Property, ScheduledVisit } from '@/app/types';
import { MapPin, Bed, Bath, Maximize2, Calendar, MessageCircle, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import ScheduleVisitDialog from './ScheduleVisitDialog';
import { sampleProperties } from '@/app/data';
import { toast } from 'sonner';
import { UserData } from './AuthDialog';
import UserMenu from './UserMenu';
import Footer from './Footer';

interface PropertyPageProps {
  onNavigate: (page: Page, query?: string, property?: Property) => void;
  propertyId?: string;
  onScheduleVisit?: (visit: any) => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export default function PropertyPage({ onNavigate, propertyId = '1', onScheduleVisit, currentUser, onOpenAuth, onSignOut }: PropertyPageProps) {
  const property = sampleProperties.find(p => p.id === propertyId) || sampleProperties[0];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleContact = () => {
    toast.success(`Opening chat with ${property.owner.name}`);
    setTimeout(() => onNavigate('conversation', '', property), 500);
  };

  const handleScheduleVisit = (visit: any) => {
    if (onScheduleVisit) {
      onScheduleVisit(visit);
    }
    toast.success('Visit scheduled successfully!');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#f0effb] py-6 px-8">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[44px] text-[#110229] uppercase tracking-[-1.32px] cursor-pointer hover:text-[#7065f0] transition-colors">
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
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] px-[16px] py-[32px] mx-[96px] my-[0px]" style="margin:0 auto;">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('conversation')}
          className="flex items-center gap-2 text-[#7065f0] hover:text-[#5048c7] transition-colors font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px]"  style="padding-bottom:20px;">
          <ChevronLeft className="w-5 h-5" />
          Back to conversation 2
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="relative rounded-[12px] overflow-hidden bg-[#f0effb] aspect-video">
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#110229]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-[#110229]" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-[12px] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative rounded-[8px] overflow-hidden aspect-video ${
                      currentImageIndex === idx ? 'ring-2 ring-[#7065f0]' : ''
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${property.title} - ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Title and Location */}
            <div>
              <h1 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[36px] text-[#110229] mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-[#8f90a6]">
                <MapPin className="w-5 h-5" />
                <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px]">
                  {property.address}
                </span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex gap-6 py-4 border-y border-[#f0effb]">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#7065f0]" />
                <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                  {property.beds} Beds
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#7065f0]" />
                <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                  {property.baths} Baths
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-5 h-5 text-[#7065f0]" />
                <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#110229]">
                  {property.size}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-3">
                Description
              </h2>
              <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] leading-relaxed">
                {property.description || 'A beautiful property waiting for you to make it your home.'}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[24px] text-[#110229] mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#7065f0]/10 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#7065f0]" />
                      </div>
                      <span className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229]">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Price and CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 border border-[#f0effb] rounded-[12px] p-6 space-y-6">
              {/* Price */}
              <div>
                <div className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[32px] text-[#7065f0]">
                  ${property.price.toLocaleString()}
                  <span className="text-[16px] text-[#8f90a6] font-medium">
                    {property.priceType === 'month' ? '/month' : ''}
                  </span>
                </div>
                {property.priceType === 'sale' && (
                  <p className="text-[14px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                    For Sale
                  </p>
                )}
              </div>

              {/* Owner Info */}
              <div className="pt-6 border-t border-[#f0effb]">
                <p className="text-[12px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif] mb-2">
                  Listed by
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-[#7065f0] rounded-full flex items-center justify-center text-white font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[16px]">
                    {property.owner.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[16px] text-[#110229]">
                      {property.owner.name}
                    </p>
                    <p className="text-[12px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif] capitalize">
                      {property.owner.type}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] text-[#8f90a6] font-['Plus_Jakarta_Sans:Medium',sans-serif]">
                  Typically responds in {property.owner.responseTime}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-6 border-t border-[#f0effb]">
                <Button 
                  className="w-full"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  Schedule a Visit
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleContact}
                >
                  Contact Owner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Visit Dialog */}
      <ScheduleVisitDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        property={property}
        ownerName={property.owner.name}
        onConfirm={handleScheduleVisit}
      />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
