import React from 'react';
import { X, Trash2, ArrowRight, Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Property, Currency, CURRENCIES } from '../types/property';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  allProperties: Property[];
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  currentLang: 'en' | 'ar';
  currency: Currency;
  onScheduleAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  allProperties,
  onRemoveFavorite,
  onSelectProperty,
  currentLang,
  currency,
  onScheduleAll,
}) => {
  if (!isOpen) return null;

  const isAr = currentLang === 'ar';
  const curr = CURRENCIES[currency];

  const savedProperties = allProperties.filter((p) => favorites.includes(p.id));
  const totalValueUSD = savedProperties.reduce((acc, curr) => acc + curr.price, 0);

  const formatPrice = (priceUSD: number) => {
    const val = priceUSD * curr.rate;
    if (curr.code === 'INR') {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    return `${curr.symbol}${val.toLocaleString(curr.locale, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#EDE6DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h3 className="font-bold text-lg text-[#0F223A] font-serif-display">
              {isAr ? 'عقاراتك المفضلة' : 'Saved Collection'} ({savedProperties.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Saved Properties */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#F3EFE6] flex items-center justify-center text-[#8C6D46] mx-auto mb-4">
                <Heart className="w-7 h-7 text-[#8C6D46]" />
              </div>
              <h4 className="font-bold text-[#0F223A] mb-1">
                {isAr ? 'لا توجد عقارات محفوظة بعد' : 'No saved homes yet'}
              </h4>
              <p className="text-xs text-[#718096] max-w-xs mx-auto">
                {isAr
                  ? 'انقر على رمز القلب في أي عقار لحفظه ومقارنته لاحقاً.'
                  : 'Click the heart icon on any property to save it to your curated collection.'}
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="group p-3 rounded-2xl bg-[#FBF9F5] border border-[#EDE6DC] hover:border-[#B89368] transition-all flex gap-3 relative cursor-pointer"
                onClick={() => {
                  onSelectProperty(prop);
                  onClose();
                }}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#EAE4D7] shrink-0">
                  <img src={prop.image} alt={prop.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-[#0F223A] group-hover:text-[#8C6D46] transition-colors leading-tight">
                      {isAr ? prop.titleAr : prop.title}
                    </h5>
                    <p className="text-[11px] text-[#718096] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#B89368]" />
                      <span>{isAr ? prop.locationAr : prop.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm text-[#102238] font-serif-display">
                      {formatPrice(prop.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(prop.id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white transition-colors"
                      title={isAr ? 'إزالة' : 'Remove'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Total & CTA */}
        {savedProperties.length > 0 && (
          <div className="p-6 border-t border-[#EDE6DC] bg-[#FAF8F5] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#718096] uppercase font-bold tracking-wider">
                {isAr ? 'إجمالي قيمة المجموعة' : 'Portfolio Total Value'}
              </span>
              <span className="text-lg font-bold text-[#0F223A] font-serif-display">
                {formatPrice(totalValueUSD)}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onScheduleAll();
              }}
              className="w-full bg-[#102238] hover:bg-[#1A3456] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'طلب جولة للمجموعة المختارة' : 'Book Viewing for Saved Homes'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
