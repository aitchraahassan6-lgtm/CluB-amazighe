import React, { useState } from 'react';
import { MapPin, Bed, Bath, Maximize2, ArrowRight, Heart } from 'lucide-react';
import { Property, Currency, CURRENCIES, PropertyType } from '../types/property';

interface FeaturedPropertiesProps {
  currentLang: 'en' | 'ar';
  currency: Currency;
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  activeFilter: PropertyType | 'all';
  onFilterChange: (type: PropertyType | 'all') => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  currentLang,
  currency,
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  activeFilter,
  onFilterChange,
}) => {
  const isAr = currentLang === 'ar';
  const curr = CURRENCIES[currency];

  const formatPrice = (priceUSD: number) => {
    const converted = priceUSD * curr.rate;
    if (curr.code === 'INR') {
      // In India, real estate is often spoken in Crores (Cr) or formatted with INR locale
      const inCr = (converted / 10000000).toFixed(2);
      return `₹${inCr} Cr`;
    }
    return `${curr.symbol}${converted.toLocaleString(curr.locale, { maximumFractionDigits: 0 })}`;
  };

  const categories: { key: PropertyType | 'all'; label: string; labelAr: string }[] = [
    { key: 'all', label: 'All Homes', labelAr: 'الكل' },
    { key: 'villa', label: 'Villas', labelAr: 'فلل' },
    { key: 'apartment', label: 'Apartments', labelAr: 'شقق' },
    { key: 'bungalow', label: 'Bungalows', labelAr: 'بيوت ريفية' },
    { key: 'penthouse', label: 'Penthouses', labelAr: 'بنتهاوس' },
  ];

  return (
    <section id="properties" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching wireframe */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            {/* Top 5 dots kicker */}
            <div className="flex items-center gap-1.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#102238]"></span>
              ))}
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F223A] font-serif-display tracking-tight">
              {isAr ? 'منازل مختارة بعناية لأجلك' : 'Handpicked Homes for You'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Interactive Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#EFEAE0] rounded-xl overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => onFilterChange(cat.key)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === cat.key
                      ? 'bg-[#102238] text-white shadow-sm'
                      : 'text-[#4A5568] hover:text-[#0F223A] hover:bg-white/50'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.label}
                </button>
              ))}
            </div>

            {/* View All Properties Link */}
            <button
              onClick={() => onFilterChange('all')}
              className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0F223A] hover:text-[#8C6D46] transition-colors whitespace-nowrap"
            >
              <span>{isAr ? 'عرض كل العقارات' : 'View All Properties'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* 3-Column Card Grid directly replicating the wireframe cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => {
            const isFav = favorites.includes(property.id);

            return (
              <div
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E6E0D6] hover:border-[#B89368]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
              >
                
                {/* Image Showcase Container with Badges */}
                <div className="relative aspect-[4/3] bg-[#EFEAE0] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>

                  {/* Top Left Badge (dark navy pill with 4 dots / text) */}
                  <div className="absolute top-4 left-4 bg-[#102238]/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B89368]"></span>
                    <span>{isAr ? property.tagAr : property.tag}</span>
                  </div>

                  {/* Top Right Heart Favorite Button */}
                  <button
                    onClick={(e) => onToggleFavorite(property.id, e)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0F223A] hover:bg-white hover:scale-110 transition-all shadow-md"
                    title={isFav ? (isAr ? 'إزالة من المحفوظات' : 'Remove Favorite') : (isAr ? 'حفظ العقار' : 'Save Property')}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-[#4A5568]'}`} />
                  </button>

                  {/* City Badge on Bottom Image */}
                  <div className="absolute bottom-3 left-4 text-white text-xs font-medium drop-shadow flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B89368]" />
                    <span>{isAr ? property.locationAr : property.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#0F223A] font-serif-display group-hover:text-[#8C6D46] transition-colors mb-3">
                      {isAr ? property.titleAr : property.title}
                    </h3>

                    {/* Specs Row: Beds, Baths, Sqft with clean icons matching wireframe */}
                    <div className="flex items-center justify-between text-xs font-medium text-[#5A6A80] py-3 border-y border-[#F0EBE1] mb-4">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-[#8C6D46]" />
                        <span>{property.beds} {isAr ? 'غرف' : 'Beds'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-[#8C6D46]" />
                        <span>{property.baths} {isAr ? 'حمامات' : 'Baths'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-[#8C6D46]" />
                        <span>{property.sqft.toLocaleString()} {isAr ? 'قدم²' : 'sq ft'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Price + Arrow Action Button matching wireframe */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-[#718096] uppercase font-bold tracking-wider block">
                        {isAr ? 'سعر البيع' : 'Guide Price'}
                      </span>
                      <span className="text-xl font-extrabold text-[#0F223A] font-serif-display">
                        {formatPrice(property.price)}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#F3EFE6] group-hover:bg-[#102238] flex items-center justify-center text-[#0F223A] group-hover:text-white transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
