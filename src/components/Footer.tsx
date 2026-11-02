import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  currentLang: 'en' | 'ar';
  onNavigateSection: (sectionId: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigateSection, onOpenLegal }) => {
  const isAr = currentLang === 'ar';

  return (
    <footer id="contact" className="bg-[#FAF7F2] border-t border-[#E6E0D6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#E8E1D5]">
          
          {/* Col 1: Brand Info matching wireframe */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] flex items-center justify-center text-[#8C6D46] shadow-sm">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#B89368] stroke-[#4A3B2C] stroke-1">
                  <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" />
                  <path d="M9 10h6v3H9z" fill="#FFF" stroke="#4A3B2C" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg text-[#0F223A] font-serif-display tracking-tight">
                  Everlight Homes
                </span>
                <div className="flex gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89368]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#102238]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C6D46]"></span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5A6A80] leading-relaxed max-w-sm mb-6">
              {isAr
                ? 'منصة متخصصة في توفير أرقى العقارات المعمارية والمنازل العصرية، مع ضمانات قانونية وتجربة عملاء استثنائية.'
                : 'Premier real estate firm dedicated to curated architectural homes, verified titles, and seamless lifestyle transitions.'}
            </p>

            <div className="text-xs text-[#718096]">
              <p className="font-semibold text-[#0F223A]">{isAr ? 'الترخيص العقاري المعتمد' : 'Licensed Real Estate Brokerage'}</p>
              <p>DRE #02194810 · Member of Luxury Portfolio International</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-4">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#5A6A80]">
              <li>
                <button
                  onClick={() => onNavigateSection('properties')}
                  className="hover:text-[#0F223A] transition-colors"
                >
                  {isAr ? 'العقارات المميزة' : 'Featured Properties'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('why-us')}
                  className="hover:text-[#0F223A] transition-colors"
                >
                  {isAr ? 'ضمانات إيفرلايت' : 'Verified Security'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('story')}
                  className="hover:text-[#0F223A] transition-colors"
                >
                  {isAr ? 'عن الشركة وقصتنا' : 'About Our Story'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('calculator')}
                  className="hover:text-[#0F223A] transition-colors"
                >
                  {isAr ? 'حاسبة التمويل العقاري' : 'Mortgage Estimator'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Get in Touch matching wireframe */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-4">
              {isAr ? 'تواصل معنا' : 'Get in Touch'}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#5A6A80]">
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[#8C6D46] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-[#0F223A]">+1 (800) 492-3810</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[#8C6D46] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-[#0F223A]">concierge@everlighthomes.com</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#EFEAE0] flex items-center justify-center text-[#8C6D46] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isAr 
                    ? '450 جادة نيو هوب، بيفرلي هيلز، كاليفورنيا 90210' 
                    : '450 New Hope Boulevard, Beverly Hills, CA 90210'}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us matching wireframe social icons */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-4">
              {isAr ? 'تابعنا على' : 'Follow Us'}
            </h4>
            
            {/* Social Icons matching wireframe */}
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/profile.php?id=61556778545729"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook - نادي الثقافة الأمازيغية ببرشيد"
                className="w-9 h-9 rounded-full bg-[#102238] text-white flex items-center justify-center hover:bg-[#B89368] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/club_de_la_culture_amazighe?obrf=MTk2MGc5bTBnb3duaw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram - نادي الثقافة الأمازيغية ببرشيد"
                className="w-9 h-9 rounded-full bg-[#102238] text-white flex items-center justify-center hover:bg-[#B89368] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-[#102238] text-white flex items-center justify-center hover:bg-[#B89368] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-[#102238] text-white flex items-center justify-center hover:bg-[#B89368] transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar matching wireframe bottom text */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718096] gap-4">
          <p>© 2026 Everlight Homes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-[#0F223A] transition-colors underline-offset-4 hover:underline"
            >
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
            <span className="text-[#DDD5C7]">|</span>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-[#0F223A] transition-colors underline-offset-4 hover:underline"
            >
              {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
