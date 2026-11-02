import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, Calendar, ShieldCheck, Heart, Share2, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { Property, Currency, CURRENCIES } from '../types/property';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  currentLang: 'en' | 'ar';
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onBookTour: (property: Property) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  currentLang,
  currency,
  isFavorite,
  onToggleFavorite,
  onBookTour,
}) => {
  if (!property) return null;

  const isAr = currentLang === 'ar';
  const curr = CURRENCIES[currency];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const formatPrice = (priceUSD: number) => {
    const val = priceUSD * curr.rate;
    if (curr.code === 'INR') {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `${curr.symbol}${val.toLocaleString(curr.locale, { maximumFractionDigits: 0 })}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E6E0D6] overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8C6D46] uppercase tracking-wider">
              {isAr ? property.tagAr : property.tag}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-[#718096]">
              {isAr ? `بني عام ${property.yearBuilt}` : `Built ${property.yearBuilt}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(property.id, e)}
              className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors"
              title={isAr ? 'حفظ العقار' : 'Save property'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#4A5568]'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors relative"
              title={isAr ? 'مشاركة العقار' : 'Share property'}
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5 text-[#4A5568]" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Main Photo Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#EAE4D7] shadow-inner mb-3">
              <img
                src={property.gallery[activeImageIdx] || property.image}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 bg-[#102238]/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B89368]" />
                <span>{isAr ? 'معاينة معتمدة' : 'Verified by Everlight'}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative rounded-xl overflow-hidden w-24 h-16 shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? 'border-[#102238] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title, Location & Price */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EDE6DC]">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#8C6D46] font-semibold mb-1">
                <MapPin className="w-4 h-4" />
                <span>{isAr ? property.locationAr : property.location}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F223A] font-serif-display">
                {isAr ? property.titleAr : property.title}
              </h2>
            </div>

            <div className="text-left rtl:text-right md:text-right rtl:md:text-left">
              <span className="text-xs text-[#718096] uppercase font-bold tracking-wider block">
                {isAr ? 'السعر المعروض' : 'Offered At'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#102238] font-serif-display">
                {formatPrice(property.price)}
              </span>
            </div>
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E0D6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#8C6D46] shadow-sm">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#718096] font-medium">{isAr ? 'غرف النوم' : 'Bedrooms'}</p>
                <p className="text-sm font-bold text-[#0F223A]">{property.beds} {isAr ? 'غرف' : 'Suites'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#8C6D46] shadow-sm">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#718096] font-medium">{isAr ? 'دورات المياه' : 'Bathrooms'}</p>
                <p className="text-sm font-bold text-[#0F223A]">{property.baths} {isAr ? 'حمامات' : 'Baths'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#8C6D46] shadow-sm">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#718096] font-medium">{isAr ? 'المساحة الإجمالية' : 'Total Area'}</p>
                <p className="text-sm font-bold text-[#0F223A]">{property.sqft.toLocaleString()} {isAr ? 'قدم²' : 'sq ft'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#8C6D46] shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#718096] font-medium">{isAr ? 'سنة البناء' : 'Year Built'}</p>
                <p className="text-sm font-bold text-[#0F223A]">{property.yearBuilt}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-[#0F223A] uppercase tracking-wider mb-2">
              {isAr ? 'نبذة عن العقار والتصميم' : 'Architectural Overview'}
            </h3>
            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
              {isAr ? property.descriptionAr : property.description}
            </p>
          </div>

          {/* Features Checklist */}
          <div>
            <h3 className="text-sm font-bold text-[#0F223A] uppercase tracking-wider mb-3">
              {isAr ? 'المواصفات والمزايا الحصرية' : 'Exclusive Amenities & Features'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isAr ? property.featuresAr : property.features).map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#0F223A]">
                  <span className="w-5 h-5 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[#8C6D46] shrink-0">
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Agent Card */}
          <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#EDE6DC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#DDD5C7] border-2 border-white shadow-sm shrink-0">
                <img src={property.agent.avatar} alt={property.agent.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-[#0F223A] text-sm">{property.agent.name}</h4>
                <p className="text-xs text-[#718096]">{isAr ? property.agent.roleAr : property.agent.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${property.agent.phone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-semibold text-[#0F223A] hover:bg-[#F3EFE6] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span>{property.agent.phone}</span>
              </a>
              <button
                onClick={() => onBookTour(property)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#102238] text-white text-xs font-semibold hover:bg-[#1A3456] transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B89368]" />
                <span>{isAr ? 'طلب جولة خاصة' : 'Book Viewing'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
