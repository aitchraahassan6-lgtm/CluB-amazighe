import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface LifestyleSectionProps {
  currentLang: 'en' | 'ar';
  onExploreMore: () => void;
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({ currentLang, onExploreMore }) => {
  const isAr = currentLang === 'ar';

  const stats = [
    { value: '15,400+', label: isAr ? 'عقار تم التحقق منه' : 'Active Listings' },
    { value: '$4.2B+', label: isAr ? 'إجمالي قيمة المعاملات' : 'Property Value' },
    { value: '99.6%', label: isAr ? 'نسبة رضا العملاء' : 'Satisfaction Rate' },
    { value: '18+', label: isAr ? 'عواصم عالمية' : 'Metropolitan Hubs' },
  ];

  const highlights = [
    isAr ? 'عقود ذكية وفحص ملكيات قانوني معتمد 100%' : '100% Certified Title & Escrow Security',
    isAr ? 'جولات تفاعلية افتراضية 3D بجودة فائقة' : 'Immersive 3D Spatial Virtual Tours',
    isAr ? 'استشارات تمويل عقاري مخصصة بدون فوائد مخفية' : 'Bespoke Advisory & Direct Mortgage Rates',
  ];

  return (
    <section id="story" className="py-16 lg:py-24 bg-[#FAF7F2] border-t border-[#EDE6DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Styled Card with "More Than Just a Home" script & Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#ECE4D8] border border-[#DDD5C7] shadow-xl p-4 sm:p-6 flex flex-col justify-between min-h-[420px] group">
              
              {/* Handwritten / Script Title Header matching wireframe */}
              <div className="mb-4 z-10">
                <div className="inline-block relative">
                  <h3 className="text-3xl sm:text-4xl font-serif-display italic font-semibold text-[#0F223A] tracking-tight leading-snug">
                    More Than
                    <br />
                    <span className="text-[#8C6D46] underline decoration-[#B89368]/60 underline-offset-8">
                      Just a Home
                    </span>
                  </h3>
                </div>
                {isAr && (
                  <p className="text-xs text-[#718096] font-medium mt-1">
                    أكثر من مجرد منزل — إنها تجربة حياة
                  </p>
                )}
              </div>

              {/* Lifestyle Image in the Card */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border-2 border-white">
                <img
                  src="/src/assets/images/lifestyle_home_interior_1793547682714.jpg"
                  alt="Cozy sunlit living room"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs font-medium">
                  {isAr ? 'تصميم داخلي مستدام ومريح للأعصاب' : 'Biophilic architecture & mindful living'}
                </div>
              </div>

              {/* Decorative Accent Dots */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-[#B89368]/10 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </div>

          {/* Right Side: Editorial Story & Concrete Statistics */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Top 4 Dots Kicker matching wireframe */}
            <div className="flex items-center gap-1.5 mb-3">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#102238]"></span>
              ))}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F223A] font-serif-display tracking-tight leading-tight mb-5">
              {isAr ? (
                <>
                  نصنع تجارب تحوّل العقارات <br />
                  <span className="text-[#8C6D46] italic font-normal">إلى أماكن انتماء حقيقية</span>
                </>
              ) : (
                <>
                  Crafting Experiences That Turn <br />
                  <span className="text-[#8C6D46] italic font-normal">Real Estate Into Belonging</span>
                </>
              )}
            </h2>

            {/* Mockup Paragraph Text */}
            <p className="text-base sm:text-lg text-[#5A6A80] leading-relaxed mb-8">
              {isAr
                ? 'سواء كنت تشتري، تبيع، أو تستأجر، فإننا نجعل العملية بسيطة وشفافة وخالية تماماً من الضغوط. منزل أحلامك أقرب إليك مما تتخيل.'
                : 'Whether you\'re buying, selling or renting, we make the process simple, transparent and stress-free. Your dream home is closer than you think.'}
            </p>

            {/* Highlights List */}
            <div className="space-y-3 mb-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-[#0F223A]">
                  <CheckCircle2 className="w-5 h-5 text-[#8C6D46] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* 4 Stat Columns with Circular Indicators matching wireframe */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#E8E1D5]">
              {stats.map((s, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#B89368]"></span>
                    <span className="text-xl sm:text-2xl font-black text-[#0F223A] font-serif-display">
                      {s.value}
                    </span>
                  </div>
                  <span className="text-xs text-[#718096] font-medium">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
