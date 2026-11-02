import React from 'react';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface CtaBannerProps {
  currentLang: 'en' | 'ar';
  onScheduleTour: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ currentLang, onScheduleTour }) => {
  const isAr = currentLang === 'ar';

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Navy Container matching wireframe */}
        <div className="relative rounded-3xl bg-[#102238] overflow-hidden border border-[#1A3456] shadow-2xl p-8 sm:p-12 lg:p-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-white">
              
              {/* 4 dots kicker */}
              <div className="flex items-center gap-1.5 mb-4">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="w-2.5 h-2.5 rounded-full bg-[#B89368]"></span>
                ))}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-display tracking-tight leading-tight mb-4 text-white">
                {isAr ? (
                  <>
                    جاهز لبدء رحلتك <br />
                    <span className="text-[#D6B588] italic font-normal">نحو منزلك المستقبلي؟</span>
                  </>
                ) : (
                  <>
                    Ready to Find Your <br />
                    <span className="text-[#D6B588] italic font-normal">Next Forever Sanctuary?</span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-8">
                {isAr
                  ? 'تحدث مع نخبة مستشارينا المعتمدين، أو احجز جولة خاصة لأي من عقاراتنا الفاخرة مع خدمة سيارة خاصة واستقبال فندقي.'
                  : 'Connect with our accredited architectural advisors today, or schedule a private white-glove viewing of our premier properties.'}
              </p>

              {/* Tan/Golden Pill Action Button matching wireframe */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onScheduleTour}
                  className="bg-[#B89368] hover:bg-[#A37F55] text-[#0F223A] font-bold text-sm px-6 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 group"
                >
                  <Calendar className="w-4 h-4 text-[#0F223A]" />
                  <span>{isAr ? 'حجز استشارة خاصة مجانية' : 'Schedule Private Consultation'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{isAr ? 'مستشارونا متاحون اليوم' : 'Advisors available today'}</span>
                </div>
              </div>

            </div>

            {/* Right Side: Architectural Schematic / Blueprint Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm overflow-hidden aspect-[16/10] flex items-center justify-center">
                
                {/* SVG Blueprint Wireframe Lines */}
                <svg className="absolute inset-0 w-full h-full stroke-white/15" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0" y1="0" x2="100%" y2="100%" strokeWidth="1" strokeDasharray="6 6" />
                  <line x1="100%" y1="0" x2="0" y2="100%" strokeWidth="1" strokeDasharray="6 6" />
                  <rect x="15%" y="15%" width="70%" height="70%" fill="none" strokeWidth="1" />
                  <circle cx="50%" cy="50%" r="28%" fill="none" strokeWidth="1" strokeDasharray="4 4" />
                </svg>

                {/* Floating Architectural Badge */}
                <div className="relative z-10 text-center p-4 rounded-xl bg-[#0C1B2E]/90 border border-[#B89368]/30 max-w-xs shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-[#B89368]/20 flex items-center justify-center text-[#D6B588] mx-auto mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-white font-bold text-sm">
                    {isAr ? 'عضوية إيفرلايت الخاصة' : 'Everlight Private Desk'}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {isAr ? 'عقارات حصرية غير معروضة في السوق العام' : 'Access off-market estates & pre-market releases'}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B89368]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
};
