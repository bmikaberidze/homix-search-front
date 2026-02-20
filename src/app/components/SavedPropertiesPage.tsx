import { Button } from './ui/button';
import { Heart, Search } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Property } from '@/app/types';
import { toast } from 'sonner';

export default function SavedPropertiesPage() {
  const navigate = useNavigate();
  const { savedProperties, handleSaveProperty } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(savedProperties);

  useEffect(() => {
    if (searchQuery) {
      const filtered = savedProperties.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(savedProperties);
    }
  }, [searchQuery, savedProperties]);

  const handleViewProperty = (propertyId: string) => {
    toast.error(`Viewing property is not available yet.`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12 flex-grow w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold text-[48px] text-[#110229] mb-2 flex items-center gap-3">
            <Heart className="w-12 h-12 text-[#7065f0] fill-[#7065f0]" />
            Saved Properties
          </h1>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[18px] text-[#8f90a6]">
            {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Search */}
        {savedProperties.length > 0 && (
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f90a6]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved properties..."
              className="w-full h-[48px] pl-10 pr-4 border-[1.5px] border-[#f0effb] rounded-[8px] font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[14px] text-[#110229] placeholder:text-[#8f90a6] focus:border-[#7065f0] focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => handleViewProperty(property.id)}
              showOwnerInfo={true}
              isSaved={true}
              onSaveToggle={() => handleSaveProperty(property.id)}
            />
          ))}
        </div>
      ) : savedProperties.length > 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-[#8f90a6] mx-auto mb-4" />
          <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229] mb-2">
            No properties match your search
          </h3>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] mb-6">
            Try adjusting your search terms
          </p>
          <Button onClick={() => setSearchQuery('')} variant="outline">
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-[#8f90a6] mx-auto mb-4" />
          <h3 className="font-['Plus_Jakarta_Sans:Bold',sans-serif] text-[24px] text-[#110229] mb-2">
            No saved properties yet
          </h3>
          <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] text-[16px] text-[#8f90a6] mb-6">
            Start browsing properties and save your favorites here
          </p>
          <Button onClick={() => navigate('/chat', { state: { newConversation: true } })} className="bg-[#7065f0] text-white hover:bg-[#5048c7]">
            Browse Properties
          </Button>
        </div>
      )}
    </div>
  );
}
