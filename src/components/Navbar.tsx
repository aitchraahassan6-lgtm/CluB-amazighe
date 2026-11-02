import React from 'react';
import { Heart, Globe, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { Currency, CURRENCIES } from '../types/property';

interface NavbarProps {
  currentLang: 'en' | 'ar';
  onToggleLang: () => void;
  currency: Currency;
  onChangeCurrency: (curr: Currency) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenSchedule: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  currency,
  onChangeCurrency,
  favoritesCount,
  onOpenFavorites,
  onOpenSchedule,
  onNavigateSection,
}) => {
  const isAr = currentLang === 'ar';

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E9E4DC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Brand Zone: Cottage Icon + Everlight Homes */}
        <div 
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] flex items-center justify-center text-[#8C6D46] shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#B89368] stroke-[#4A3B2C] stroke-1">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
              <path d="M9 10h6v3H9z" fill="#FFF" stroke="#4A3B2C" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#0F223A] font-serif-display">
                Everlight Homes
              </span>
              <div className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89368]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#102238]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D46]"></span>
              </div>
            </div>
            <p className="text-[11px] text-[#718096] -mt-1 font-medium hidden sm:block">
              {isAr ? 'بيوت معمارية فاخرة' : 'Modern Living & Prime Locations'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#4A5568]">
          <button 
            onClick={() => onNavigateSection('properties')}
            className="hover:text-[#0F223A] transition-colors whitespace-nowrap"
          >
            {isAr ? 'عقارات مختارة' : 'Properties'}
          </button>
          <button 
            onClick={() => onNavigateSection('why-us')}
            className="hover:text-[#0F223A] transition-colors whitespace-nowrap"
          >
            {isAr ? 'لماذا إيفرلايت؟' : 'Why Us'}
          </button>
          <button 
            onClick={() => onNavigateSection('story')}
            className="hover:text-[#0F223A] transition-colors whitespace-nowrap"
          >
            {isAr ? 'قصتنا' : 'Our Story'}
          </button>
          <button 
            onClick={() => onNavigateSection('calculator')}
            className="hover:text-[#0F223A] transition-colors whitespace-nowrap"
          >
            {isAr ? 'حاسبة التمويل' : 'Mortgage'}
          </button>
          <button 
            onClick={() => onNavigateSection('contact')}
            className="hover:text-[#0F223A] transition-colors whitespace-nowrap"
          >
            {isAr ? 'اتصل بنا' : 'Contact'}
          </button>
        </nav>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as Currency)}
              aria-label="Select currency"
              className="appearance-none bg-[#F3EFE6] hover:bg-[#EAE4D7] border border-[#DDD5C7] text-[#0F223A] text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#B89368]"
            >
              {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                <option key={c} value={c}>
                  {CURRENCIES[c].symbol} {c}
                </option>
              ))}
            </select>
          </div>

          {/* Language Toggle (EN / AR) */}
          <button
            onClick={onToggleLang}
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#F3EFE6] hover:bg-[#EAE4D7] border border-[#DDD5C7] text-[#0F223A] transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#B89368]" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* Favorites Button with Badge */}
          <button
            onClick={onOpenFavorites}
            title={isAr ? 'العقارات المحفوظة' : 'Saved Homes'}
            className="relative p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] border border-transparent hover:border-[#DDD5C7] transition-all"
            aria-label="View saved favorites"
          >
            <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-[#4A5568]'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#102238] text-white text-[10px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Primary Action Button (Matches the Dark Navy Pill Button with Arrow in Wireframe!) */}
          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-2 bg-[#102238] hover:bg-[#1A3456] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all group whitespace-nowrap"
          >
            <span>{isAr ? 'حجز جولة خاصة' : 'Schedule Tour'}</span>
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
              <ArrowRight className="w-3 h-3 text-white rtl:rotate-180" />
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
