import React, { useState } from 'react';
import { MapPin, Home as HomeIcon, Search, ArrowRight, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { Currency, CURRENCIES, PropertyType } from '../types/property';

interface HeroProps {
  currentLang: 'en' | 'ar';
  currency: Currency;
  onSearch: (filters: { location: string; type: PropertyType | 'all'; priceRange: string }) => void;
  onSelectHeroHome: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  currency,
  onSearch,
  onSelectHeroHome,
}) => {
  const isAr = currentLang === 'ar';
  const curr = CURRENCIES[currency];

  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const handleSearchClick = () => {
    onSearch({
      location: selectedLocation,
      type: selectedType,
      priceRange: selectedPriceRange,
    });
  };

  return (
    <section id="hero" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Top Grid: Left Editorial Content + Right Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-10 lg:mb-16">
          
          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Top Dot Indicators / Rating Kicker */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#B89368]"></span>
                ))}
              </div>
              <span className="text-xs font-semibold tracking-wider text-[#4A5568] uppercase ml-1">
                {isAr ? 'منصة العقارات الأكثر ثقة لعام 2026' : 'Premier Real Estate Platform 2026'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F223A] tracking-tight leading-[1.12] mb-6 font-serif-display">
              {isAr ? (
                <>
                  ابحث عن ملاذك المثالي <br />
                  <span className="text-[#8C6D46] italic font-normal">في أرقى المواقع</span>
                </>
              ) : (
                <>
                  Find Your Sanctuary <br />
                  <span className="text-[#8C6D46] italic font-normal">in Prime Locations</span>
                </>
              )}
            </h1>

            {/* Tagline from Mockup */}
            <p className="text-base sm:text-lg text-[#5A6A80] max-w-xl leading-relaxed mb-8">
              {isAr 
                ? 'اكتشف منازل عصرية، ومواقع استثنائية، ومجتمعات سكنية فاخرة — كل ذلك في منصة موثوقة واحدة.'
                : 'Discover modern homes, prime locations and lifestyle-driven communities — all in one place.'}
            </p>

            {/* Quick Metrics / Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#E8E1D5] max-w-lg">
              <div>
                <p className="text-2xl font-bold text-[#0F223A] font-serif-display">15,000+</p>
                <p className="text-xs text-[#718096] font-medium">
                  {isAr ? 'عقار موثق' : 'Verified Homes'}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F223A] font-serif-display">99.4%</p>
                <p className="text-xs text-[#718096] font-medium">
                  {isAr ? 'رضا العملاء' : 'Client Rating'}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F223A] font-serif-display">0%</p>
                <p className="text-xs text-[#718096] font-medium">
                  {isAr ? 'رسوم خفية' : 'Hidden Fees'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: High Impact Architectural Visual Frame */}
          <div className="lg:col-span-6 relative">
            <div 
              onClick={onSelectHeroHome}
              className="group relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#EAE4D7] aspect-[16/11] cursor-pointer"
            >
              <img
                src="/src/assets/images/hero_modern_villa_1793547681326.jpg"
                alt="Everlight Modern Luxury Villa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Subtle architectural gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1B2E]/70 via-transparent to-black/10"></div>

              {/* Floating Highlight Card on the image */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/60 flex items-center justify-between gap-4 max-w-sm">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B89368] mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAr ? 'عقار الأسبوع المميز' : 'Property of the Week'}</span>
                  </div>
                  <h4 className="font-bold text-[#0F223A] text-sm">
                    {isAr ? 'قصر البافيليون الزجاجي' : 'The Glass Pavilion'}
                  </h4>
                  <p className="text-xs text-[#718096]">
                    {isAr ? 'بيفرلي كريست، لوس أنجلوس' : 'Beverly Crest, Los Angeles'}
                  </p>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="text-xs text-[#718096] block">{isAr ? 'السعر' : 'Price'}</span>
                  <span className="text-sm font-bold text-[#102238]">
                    {curr.symbol}{(3650000 * (curr.rate === 1 ? 1 : curr.rate)).toLocaleString(curr.locale, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Top tag badge */}
              <div className="absolute top-4 right-4 bg-[#102238]/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89368]" />
                <span>{isAr ? 'فحص قانوني معتمد' : 'Verified Title'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Floating Multi-Filter Search Bar (Matches Wireframe Bar Perfectly!) */}
        <div className="relative max-w-5xl mx-auto -mt-4 lg:-mt-8 z-30">
          <div className="bg-white rounded-3xl sm:rounded-full p-3 sm:p-2.5 shadow-xl border border-[#E4DDD0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
            
            {/* Field 1: Location */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-[#F9F7F2] rounded-2xl sm:rounded-full transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#F3EFE6] flex items-center justify-center text-[#8C6D46] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left rtl:text-right">
                <label htmlFor="search-location" className="block text-[11px] font-semibold text-[#8C6D46] uppercase tracking-wider">
                  {isAr ? 'الموقع أو المدينة' : 'Location'}
                </label>
                <select
                  id="search-location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#0F223A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">{isAr ? 'كل المواقع المميزة' : 'All Prime Locations'}</option>
                  <option value="Malibu">{isAr ? 'ماليبو، كاليفورنيا' : 'Malibu, CA'}</option>
                  <option value="New York">{isAr ? 'مانهاتن، نيويورك' : 'Manhattan, New York'}</option>
                  <option value="Aspen">{isAr ? 'أسبن، كولورادو' : 'Aspen, Colorado'}</option>
                  <option value="Los Angeles">{isAr ? 'لوس أنجلوس، كاليفورنيا' : 'Los Angeles, CA'}</option>
                  <option value="Miami">{isAr ? 'ميامي، فلوريدا' : 'Miami, Florida'}</option>
                  <option value="Sonoma">{isAr ? 'وادي سونوما' : 'Sonoma Valley'}</option>
                </select>
              </div>
            </div>

            {/* Subtle Divider Dot */}
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#DDD5C7]"></span>

            {/* Field 2: Property Type */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-[#F9F7F2] rounded-2xl sm:rounded-full transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#F3EFE6] flex items-center justify-center text-[#8C6D46] shrink-0">
                <HomeIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left rtl:text-right">
                <label htmlFor="search-property-type" className="block text-[11px] font-semibold text-[#8C6D46] uppercase tracking-wider">
                  {isAr ? 'نوع العقار' : 'Property Type'}
                </label>
                <select
                  id="search-property-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as PropertyType | 'all')}
                  className="w-full text-xs sm:text-sm font-semibold text-[#0F223A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">{isAr ? 'جميع الأنواع' : 'All Property Types'}</option>
                  <option value="villa">{isAr ? 'فلل معمارية فاخرة' : 'Luxury Villas'}</option>
                  <option value="apartment">{isAr ? 'شقق وأبراج حصرية' : 'Modern Apartments'}</option>
                  <option value="bungalow">{isAr ? 'بيوت وبنغلو ريفية' : 'Serene Bungalows'}</option>
                  <option value="penthouse">{isAr ? 'بنتهاوس بإطلالات بانورامية' : 'Sky Penthouses'}</option>
                </select>
              </div>
            </div>

            {/* Subtle Divider Dot */}
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#DDD5C7]"></span>

            {/* Field 3: Price Range (with Currency Symbol) */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-[#F9F7F2] rounded-2xl sm:rounded-full transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#F3EFE6] flex items-center justify-center text-[#8C6D46] shrink-0 font-bold text-sm">
                {curr.symbol}
              </div>
              <div className="flex-1 text-left rtl:text-right">
                <label htmlFor="search-price-range" className="block text-[11px] font-semibold text-[#8C6D46] uppercase tracking-wider">
                  {isAr ? 'نطاق الميزانية' : 'Price Range'}
                </label>
                <select
                  id="search-price-range"
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#0F223A] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="all">{isAr ? 'أي ميزانية' : 'Any Budget'}</option>
                  <option value="under-1.5m">
                    {isAr ? `أقل من ${curr.symbol}1.5M` : `Under ${curr.symbol}1.5M`}
                  </option>
                  <option value="1.5m-2.5m">
                    {curr.symbol}1.5M – {curr.symbol}2.5M
                  </option>
                  <option value="above-2.5m">
                    {isAr ? `أكثر من ${curr.symbol}2.5M` : `Above ${curr.symbol}2.5M`}
                  </option>
                </select>
              </div>
            </div>

            {/* Search Pill Button (Magnifying Glass + Dots + Arrow, directly replicating the wireframe button!) */}
            <button
              onClick={handleSearchClick}
              className="flex items-center justify-center gap-2.5 bg-[#102238] hover:bg-[#1A3456] text-white px-6 py-3.5 rounded-2xl sm:rounded-full transition-all group shrink-0 shadow-md hover:shadow-lg"
              title={isAr ? 'بحث عن العقارات' : 'Search Properties'}
            >
              <Search className="w-4 h-4 text-[#B89368]" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89368]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70"></span>
              </div>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};
