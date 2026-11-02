import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
  currentLang: 'en' | 'ar';
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose, currentLang }) => {
  if (!type) return null;

  const isAr = currentLang === 'ar';
  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E6E0D6] overflow-hidden my-8 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8C6D46]" />
            <h3 className="font-bold text-base text-[#0F223A] font-serif-display">
              {isPrivacy 
                ? (isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy') 
                : (isAr ? 'الشروط والأحكام العقارية' : 'Terms & Brokerage Conditions')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#4A5568] leading-relaxed">
          {isPrivacy ? (
            <>
              <p>
                {isAr
                  ? 'تلتزم إيفرلايت هومز بحماية خصوصية جميع العملاء والمستثمرين والملاك. كافة البيانات المالية والشخصية المتعلقة بالمعاملات العقارية يتم تشفيرها وفق أعلى معايير الأمان المصرفي.'
                  : 'At Everlight Homes, privacy and confidentiality are paramount. All client information, property valuations, and financial assessments are treated with bank-grade security and confidentiality.'}
              </p>
              <h4 className="font-bold text-[#0F223A] text-sm pt-2">
                {isAr ? '1. جمع البيانات واستخدامها' : '1. Data Collection & Escrow Verification'}
              </h4>
              <p>
                {isAr
                  ? 'نقوم بجمع المعلومات اللازمة فقط لإتمام المعاينات، وإعداد عقود الشراء أو الإيجار، وتأكيد الهويات العقارية.'
                  : 'We collect relevant identity, residency, and transaction details strictly for legal title verification, mortgage assessment, and escrow scheduling.'}
              </p>
              <h4 className="font-bold text-[#0F223A] text-sm pt-2">
                {isAr ? '2. سرية المعاملات الحصرية (Off-Market)' : '2. Off-Market Estate Confidentiality'}
              </h4>
              <p>
                {isAr
                  ? 'لا يتم مشاركة عناوين العقارات الحصرية غير المعروضة للعامة إلا مع مشترين معتمدين بعد توقيع اتفاقيات عدم الإفصاح.'
                  : 'Off-market trophy estates and private collections remain confidential and are only disclosed to qualified buyers upon execution of mutual non-disclosure agreements.'}
              </p>
            </>
          ) : (
            <>
              <p>
                {isAr
                  ? 'أهلاً بكم في إيفرلايت هومز. باستخدامكم لهذه المنصة، فإنكم توافقون على الالتزام بالقوانين المنظمة للوساطة العقارية المعتمدة والتصرف بحسن نية في تقديم العروض وحجز المواعيد.'
                  : 'Welcome to Everlight Homes. By accessing our platform and scheduling property tours, you agree to comply with standard brokerage guidelines, verified legal deed reviews, and fiduciary representations.'}
              </p>
              <h4 className="font-bold text-[#0F223A] text-sm pt-2">
                {isAr ? '1. فحص الملكية والمواصفات' : '1. Title & Inspection Assurance'}
              </h4>
              <p>
                {isAr
                  ? 'تخضع جميع العقارات المعروضة للفحص الهندسي والقانوني لضمان خلوها من أي نزاعات أو عيوب جوهرية قبل إتمام المعاملة.'
                  : 'All properties listed on Everlight Homes undergo legal title verifications and independent engineering inspections to ensure total transparency.'}
              </p>
              <h4 className="font-bold text-[#0F223A] text-sm pt-2">
                {isAr ? '2. حجوزات الجولات الخاصة' : '2. Private Tour Protocol'}
              </h4>
              <p>
                {isAr
                  ? 'يتم ترتيب الجولات الميدانية الخاصة بالتنسيق مع ملاك العقار مع توفير مرشد معماري معتمد للإجابة على كافة التساؤلات الفنية.'
                  : 'In-person viewings are conducted by certified architectural advisors with direct owner authorization and dedicated scheduling.'}
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-[#FAF8F5] border-t border-[#EDE6DC] text-right rtl:text-left">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#102238] text-white text-xs font-semibold rounded-xl hover:bg-[#1A3456] transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
