import React from 'react';
import { Home, ShieldCheck, Headphones, Heart } from 'lucide-react';

interface TrustFeaturesProps {
  currentLang: 'en' | 'ar';
}

export const TrustFeatures: React.FC<TrustFeaturesProps> = ({ currentLang }) => {
  const isAr = currentLang === 'ar';

  const features = [
    {
      icon: Home,
      title: isAr ? 'عقارات موثقة 100%' : 'Verified Listings',
      description: isAr 
        ? 'عقارات مفحوصة بدقة وقانونية 100% مع ملاك مباشرين وموثقين.'
        : '100% genuine listings with verified titles and accredited owners.',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'آمن وموثوق تماماً' : 'Trusted & Secure',
      description: isAr
        ? 'معاملات آمنة مع حسابات ضمان مصرفية وشفافية مالية تامة.'
        : 'Safe transactions with complete transparency and escrow support.',
    },
    {
      icon: Headphones,
      title: isAr ? 'دعم استشاري متخصص' : 'Expert Support',
      description: isAr
        ? 'إرشاد عقاري واحترافي في كل خطوة من خطوات رحلتك السكنية.'
        : 'Guidance at every step of your home buying or leasing journey.',
    },
    {
      icon: Heart,
      title: isAr ? 'أسلوب حياة أرقى' : 'Better Living',
      description: isAr
        ? 'اعثر على منزل يتناغم مع رفاهيتك، عائلتك، وطموحاتك المستقبلية.'
        : 'Find a home that truly fits your lifestyle, wellness and dreams.',
    },
  ];

  return (
    <section id="why-us" className="py-12 lg:py-16 border-y border-[#EDE6DC] bg-[#F7F4EC]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center text-center group p-4 rounded-2xl hover:bg-white/60 transition-colors"
              >
                {/* Circular Outline Icon matching wireframe */}
                <div className="w-16 h-16 rounded-full bg-[#EFEAE0] border border-[#DDD5C7] flex items-center justify-center text-[#0F223A] mb-5 group-hover:scale-110 group-hover:bg-[#B89368] group-hover:text-white group-hover:border-[#B89368] transition-all duration-300 shadow-sm">
                  <Icon className="w-7 h-7 stroke-[1.75]" />
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-[#0F223A] mb-2 font-serif-display">
                  {feat.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-[#5A6A80] leading-relaxed max-w-xs">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
