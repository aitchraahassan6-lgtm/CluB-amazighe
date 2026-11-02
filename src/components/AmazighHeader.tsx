import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Globe, ChevronDown, UserPlus, ArrowLeft, ArrowRight, Check, MapPin, Phone } from 'lucide-react';
import { SiteSettings } from '../lib/firebase';
import { makeImageTransparent } from '../utils/transparentImage';

export type Language = 'ar' | 'tm' | 'fr';

interface AmazighHeaderProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeNav: string;
  onSelectNav: (id: string) => void;
  onOpenJoinModal: () => void;
  siteSettings: SiteSettings;
}

export const AmazighHeader: React.FC<AmazighHeaderProps> = ({
  currentLang,
  onSelectLang,
  activeNav,
  onSelectNav,
  onOpenJoinModal,
  siteSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [transparentLogo, setTransparentLogo] = useState<string>('');

  // Close menus on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultClubLogo = '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
  const logoSrc = transparentLogo || siteSettings.clubLogoUrl || defaultClubLogo;

  useEffect(() => {
    const raw = siteSettings.clubLogoUrl || defaultClubLogo;
    makeImageTransparent(raw).then((clean) => {
      setTransparentLogo(clean);
    });
  }, [siteSettings.clubLogoUrl]);

  const navItems = [
    { id: 'home', labelAr: 'الرئيسية', labelTm: 'ⵜⴰⵙⵏⴰ ⵜⴰⵎⵣⵡⴰⵔⵓⵜ', labelFr: 'Accueil' },
    { id: 'bureau', labelAr: 'المكتب', labelTm: 'ⴰⵙⵉⵔⴰ', labelFr: 'Le Bureau' },
    { id: 'reviews', labelAr: 'تقييمات الزوار', labelTm: 'ⵜⵉⵏⴰⵡⵉⵏ', labelFr: 'Avis Visiteurs' },
    { id: 'contact', labelAr: 'اتصل بنا', labelTm: 'ⴰⵡⴰⴹ ⴷⵉⴷⵏⵖ', labelFr: 'Contact' },
  ];

  const getNavLabel = (item: typeof navItems[0]) => {
    if (currentLang === 'tm') return item.labelTm;
    if (currentLang === 'fr') return item.labelFr;
    return item.labelAr;
  };

  const getLangName = (lang: Language) => {
    switch (lang) {
      case 'ar': return 'العربية';
      case 'tm': return 'ⵜⴰⵎⴰⵣⵉⵖⵜ';
      case 'fr': return 'Français';
    }
  };

  const getLangShortName = (lang: Language) => {
    switch (lang) {
      case 'ar': return 'عربي';
      case 'tm': return 'ⵜⵎⵣ';
      case 'fr': return 'FR';
    }
  };

  const getJoinLabel = () => {
    switch (currentLang) {
      case 'ar': return 'انخرط';
      case 'tm': return 'ⴽⵛⵎ';
      case 'fr': return 'Adhérer';
    }
  };

  // Tamazight is LTR like French, Arabic is RTL
  const isRtl = currentLang === 'ar';

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] fixed top-0 left-0 right-0 z-50">
      
      {/* Main Navbar Row (Sleek, Compact Height, Full Fit on All Mobile Phones) */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Logo Zone: Compact, Transparent, Scales gracefully on any phone */}
          <div 
            onClick={() => onSelectNav('home')}
            className="flex items-center cursor-pointer group shrink-0"
          >
            <div className="relative py-0.5 flex items-center">
              <img
                src={logoSrc}
                alt={siteSettings.clubNameAr || "Club Logo"}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = defaultClubLogo;
                  }
                }}
                referrerPolicy="no-referrer"
                style={{ mixBlendMode: 'multiply' }}
                className="h-8 sm:h-10 md:h-11 w-auto max-w-[130px] xs:max-w-[165px] sm:max-w-[240px] md:max-w-[280px] object-contain group-hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          {/* Desktop Navigation Links (Hidden on mobile, visible on desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNav(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs xl:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1C3F3A] text-white shadow-sm'
                      : 'text-slate-700 hover:text-[#1C3F3A] hover:bg-emerald-50/70'
                  }`}
                >
                  {getNavLabel(item)}
                </button>
              );
            })}
          </nav>

          {/* Action Icons Zone: ALL ICONS ALWAYS VISIBLE ON ANY MOBILE PHONE */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* 1. Search Icon Button (Always visible on mobile & desktop) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1.5 sm:p-2 rounded-lg text-slate-700 hover:text-[#1C3F3A] hover:bg-slate-100 transition-colors flex items-center justify-center ${
                searchOpen ? 'bg-slate-100 text-[#1C3F3A]' : ''
              }`}
              aria-label="Search"
              title={currentLang === 'fr' ? 'Rechercher' : 'بحث'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 2. Language Selector Button (Always visible on mobile & desktop) */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-lg transition-colors border border-slate-200"
                title="Language / اللغة"
              >
                <Globe className="w-3.5 h-3.5 text-[#1C3F3A]" />
                <span className="hidden sm:inline">{getLangName(currentLang)}</span>
                <span className="sm:hidden">{getLangShortName(currentLang)}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                  {(['ar', 'tm', 'fr'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onSelectLang(lang);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                        currentLang === lang ? 'bg-emerald-50 text-[#1C3F3A] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{getLangName(lang)}</span>
                      {currentLang === lang && <Check className="w-3.5 h-3.5 text-[#1C3F3A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Membership / Join Button (Always visible on mobile & desktop) */}
            <button
              onClick={onOpenJoinModal}
              title={currentLang === 'fr' ? 'Adhérer' : (currentLang === 'tm' ? 'ⴽⵛⵎ ⵖⵔ ⵓⵙⵉⵔⴰⵎ' : 'الانخراط في النادي')}
              className="flex items-center gap-1 bg-[#B82B2B] hover:bg-[#9B2222] text-white text-[11px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{getJoinLabel()}</span>
            </button>

            {/* 4. Mobile Menu Hamburger Button (Always visible on mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors lg:hidden flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#B82B2B]" /> : <Menu className="w-5 h-5 text-[#1C3F3A]" />}
            </button>

          </div>

        </div>

        {/* Quick Dropdown Search Input Bar (Opens when Search icon is clicked) */}
        {searchOpen && (
          <div className="py-2 pb-3 px-1 border-t border-slate-100 flex items-center gap-2 animate-fade-in">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={currentLang === 'fr' ? 'Rechercher sur le site...' : (currentLang === 'tm' ? 'ⵔⵣⵓ ⴳ ⵓⵙⵉⵜ...' : 'ابحث في الموقع...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-xs sm:text-sm p-2 pl-8 rtl:pl-2 rtl:pr-8 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1C3F3A]"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-3" />
            </div>
            <button 
              onClick={() => setSearchOpen(false)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Mobile Drawer Menu (Responsive & Full Mobile Fit) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl animate-fade-in">
          <div className="px-4 py-4 space-y-3">

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeNav === item.id;
                const isTargetButton = item.id === 'about'; // button:nth-of-type(2)
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectNav(item.id);
                      setMobileMenuOpen(false);
                    }}
                    style={isTargetButton ? { backgroundColor: '#eae35f', color: '#0a0606' } : undefined}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                      isTargetButton
                        ? 'shadow-sm'
                        : isActive
                          ? 'bg-[#1C3F3A] text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{getNavLabel(item)}</span>
                    {isRtl ? (
                      <ArrowLeft className={`w-3.5 h-3.5 ${isTargetButton ? 'text-[#0a0606]' : (isActive ? 'text-white' : 'text-slate-400')}`} />
                    ) : (
                      <ArrowRight className={`w-3.5 h-3.5 ${isTargetButton ? 'text-[#0a0606]' : (isActive ? 'text-white' : 'text-slate-400')}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Language Switcher Buttons inside Mobile Menu */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {currentLang === 'fr' ? 'Langue' : (currentLang === 'tm' ? 'ⵜⵓⵜⵍⴰⵢⵜ' : 'اختر اللغة')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ar', 'tm', 'fr'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onSelectLang(lang);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      currentLang === lang
                        ? 'bg-[#1C3F3A] text-white border-[#1C3F3A]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {getLangName(lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Mobile Membership Button */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal();
                }}
                className="w-full bg-[#B82B2B] hover:bg-[#9B2222] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{currentLang === 'fr' ? 'Rejoindre le club / Adhésion' : (currentLang === 'tm' ? 'ⴽⵛⵎ ⵖⵔ ⵓⵙⵉⵔⴰⵎ' : 'انخرط معنا في النادي')}</span>
              </button>
            </div>

            {/* Club Contact Info on Mobile */}
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B82B2B]" />
                <span>{currentLang === 'fr' ? 'Berrechid, Maroc' : 'برشيد، المغرب'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1C3F3A]" />
                <span>{siteSettings.whatsappNumber || '+212 6 00 00 00 00'}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
