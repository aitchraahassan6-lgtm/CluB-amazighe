import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Printer, 
  MessageCircle, 
  FileText, 
  ImageIcon 
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from './AmazighHeader';
import { saveMemberToFirebase, SiteSettings } from '../lib/firebase';
import { Member } from '../types/bureau';
import { OfficialStamp } from './OfficialStamp';

interface RegistrationViewProps {
  currentLang: Language;
  onClose: () => void;
  siteSettings: SiteSettings;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ currentLang, onClose, siteSettings }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [cin, setCin] = useState('');
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [memberId] = useState(() => `CCAB-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (receiptRef.current) {
      try {
        const dataUrl = await toPng(receiptRef.current, {
          cacheBust: true,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          fontEmbedCSS: '',
        });
        const link = document.createElement('a');
        link.download = `Recu_Adhesion_${memberId}_${name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image:', err);
      }
    }
  };

  const isRtl = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const universityLevels = [
    { id: 'l1', labelAr: 'السنة الأولى جامعي (L1)', labelTm: 'ⴰⵙⴳⴳⵯⴰⵙ ⴰⵎⵣⵡⴰⵔⵓ ⴰⵙⴷⴰⵡⴰⵏ (L1)', labelFr: '1ère Année Universitaire (L1)' },
    { id: 'l2', labelAr: 'السنة الثانية جامعي (L2)', labelTm: 'ⴰ叠ⴳⴳⵯⴰⵙ ⵡⵉⵙ ⵙⵉⵏ ⴰⵙⴷⴰⵡⴰⵏ (L2)', labelFr: '2ème Année Universitaire (L2)' },
    { id: 'l3', labelAr: 'السنة الثالثة جامعي - الإجازة (L3)', labelTm: 'ⴰⵙⴳⴳⵯⴰⵙ ⵡⵉⵙ ⴽⵕⴰⴹ - ⵜⵓⵔⴰⴳⵜ (L3)', labelFr: '3ème Année Universitaire - Licence (L3)' },
    { id: 'master', labelAr: 'الماستر / دراسات عليا', labelTm: 'ⵎⴰⵙⵜⵕ / ⵜⵉⵖⵓⵔⵉⵡⵉⵏ ⵜⵉⵏⴰⴼⵍⵍⴰⵜⵉⵏ', labelFr: 'Master / Études Supérieures' },
  ];

  const interestOptions = [
    { id: 'lang', labelAr: 'تعلم كتابة وقواعد تيفيناغ', labelFr: 'Apprentissage de Tifinagh' },
    { id: 'theatre', labelAr: 'المسرح وفنون الأداء الأمازيغي', labelFr: 'Théâtre et Arts vivants' },
    { id: 'poetry', labelAr: 'الشعر والتراث الشفهي', labelFr: 'Poésie et Patrimoine oral' },
    { id: 'heritage', labelAr: 'التاريخ والأبحاث التراثية ببرشيد', labelFr: 'Histoire et Recherches locales' },
    { id: 'events', labelAr: 'تنظيم الفعاليات والمهرجانات', labelFr: 'Organisation d\'événements' },
    { id: 'media', labelAr: 'التصوير والتواصل والإعلام الرقمي', labelFr: 'Médias et Communication' },
  ];

  const toggleInterest = (id: string) => {
    setInterests((prev: string[]) => prev.includes(id) ? prev.filter((x: string) => x !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const selectedLevelObj = universityLevels.find(l => l.id === niveau);
      const levelLabel = selectedLevelObj ? selectedLevelObj.labelAr : (niveau || 'السنة الأولى جامعي (L1)');
      const newReg: Member = {
        id: memberId,
        name: name.trim(),
        cin: cin.trim() || '',
        filiere: filiere.trim(),
        niveau: levelLabel,
        phone: phone.trim(),
        email: email.trim() || '',
        feeAmount: 50,
        feePaid: false,
        registeredDate: new Date().toISOString().split('T')[0],
        notes: interests.length > 0 ? `الاهتمامات: ${interests.join('، ')}` : '',
        registrationSource: 'online_form',
        approvalStatus: 'pending',
      };
      saveMemberToFirebase(newReg);
    } catch (err) {
      console.error('Failed to save registration to Firestore:', err);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clubLogo = siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
  const schoolLogo = siteSettings.schoolLogoUrl || '/assets/aistudio/image_e594bc88.png';

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-100/70 py-6 sm:py-10 px-3 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Main Document Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
          
          {/* Header Banner - Exact match to uploaded document image */}
          <div className="pt-8 pb-4 px-4 sm:px-8 text-center bg-white border-b border-slate-100 flex flex-col items-center">
            
            {/* Top Logo Banner */}
            <div className="flex items-center justify-center mb-4 max-w-md">
              <img
                src={clubLogo}
                alt="Club Logo Header"
                className="h-16 sm:h-20 w-auto max-w-full object-contain mix-blend-multiply"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
                }}
              />
            </div>

            {/* Document Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1.5">
              {isFr 
                ? 'Formulaire d\'Adhésion & Inscription Officielle au Club' 
                : (isTm ? 'ⵜⴰⴼⵔⵜ ⵏ ⵓⴽⵛⴰⵎ ⴷ ⵓⵣⵎⵎⴻⵎ ⴰⵎⴰⴷⴷⵓⴷ ⴳ ⵓⵙⵉⵔⴰ' : 'استمارة الانخراط والتسجيل الرسمي في النادي')}
            </h1>
            
            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xl mx-auto">
              {isFr
                ? 'Club de la Culture Amazighe de Berrechid - L\'adhésion est ouverte à tous les étudiants et passionnés de culture'
                : 'نادي الثقافة الأمازيغية ببرشيد - الانخراط مفتوح لكافة الطلبة والمهتمين بالشأن الثقافي والجامعي'}
            </p>

            {/* Gray divider line across the page */}
            <div className="w-full border-b border-slate-200 mt-6" />
          </div>

          <div className="p-4 sm:p-8">
            {submitted ? (
              <div className="text-center py-8 px-4 space-y-6 animate-fade-in max-w-xl mx-auto">
                
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block font-mono">
                    {memberId}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {isFr ? 'Félicitations ! Demande d\'Adhésion Enregistrée' : (isTm ? 'ⵜⴰⵏⵎⵎⵉⵔⵜ! ⵜⵣⵎⵎⵎⵜ ⵜⴼⵔⵜ ⵏ ⵓⴽⵛⴰⵎ' : 'تهانينا! تم تسجيل طلب انخراطك بنجاح 🎉')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {isFr
                      ? 'Votre demande a bien été prise en compte par le bureau du club. Notre équipe vous contactera sous peu pour finaliser la validation et le paiement de votre cotisation.'
                      : 'تم تسجيل طلب عضويتك بنجاح لدى مكتب نادي الثقافة الأمازيغية ببرشيد. سيقوم أمين المال أو فريق التواصل بالاتصال بك قريباً لاستكمال إجراءات الانخراط واستلام بطاقتك.'}
                  </p>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs text-right space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <span>💡 ملاحظة هامة حول تحميل الوصل:</span>
                  </p>
                  <p className="text-amber-800 leading-relaxed">
                    يتم استخراج وتحميل الوصل الرسمي والتأشير عليه بالختم النهائي بعد المصادقة على أداء واجب الانخراط المستحق. يمكنك متابعة حالة طلبك أو التواصل المباشر مع النادي عبر الواتساب.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `السلام عليكم، أنا المنخرط(ة) ${name}، رقم تسجيلي هو ${memberId}. أود الاستفسار وتأكيد انخراطي بنادي الثقافة الأمازيغية ببرشيد.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{isFr ? 'Contacter le Club via WhatsApp' : 'التواصل مع إدارة النادي عبر الواتساب'}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#1C3F3A] hover:bg-[#142e2a] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <span>{isFr ? 'Retour à l\'accueil' : 'العودة إلى الصفحة الرئيسية'}</span>
                  </button>
                </div>

                <div className="pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-bold">
                  <span>{siteSettings.clubNameAr || 'نادي الثقافة الأمازيغية ببرشيد'}</span>
                  <span>•</span>
                  <span>الموسم الجامعي 2026/2027</span>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
                
                {/* 1. البيانات الشخصية للمنخرط(ة) */}
                <div className="space-y-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2 pb-1">
                    <User className="w-5 h-5 text-slate-600" />
                    <span>{isFr ? '1. Informations Personnelles' : '👤 1. البيانات الشخصية للمنخرط(ة)'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Right column: الاسم واللقب الكامل * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {isFr ? 'Nom et Prénom *' : (isTm ? 'ⵉⵙⵎ ⴷ ⵓⵙⵙⴼⵖ *' : 'الاسم واللقب الكامل *')}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isFr ? 'Ex: Mohamed Amine' : 'مثال: محمد المنصوري'}
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Left column: رقم البطاقة الوطنية (CIN) أو رمز مسار */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {isFr ? 'CIN / Massar' : 'رقم البطاقة الوطنية (CIN) أو رمز مسار'}
                      </label>
                      <input
                        type="text"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        placeholder="Ex: T123456 / K13000000"
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. المسار الجامعي والشعبة */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2 pb-1">
                    <GraduationCap className="w-5 h-5 text-slate-600" />
                    <span>{isFr ? '2. Cursus et Filière' : '🎓 2. المسار الجامعي والشعبة'}</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Full width field: الشعبة / المسلك الدراسي والتخصص * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>{isFr ? 'Filière / Spécialité *' : 'الشعبة / المسلك الدراسي والتخصص *'}</span>
                      </label>

                      <input
                        type="text"
                        required
                        value={filiere}
                        onChange={(e) => setFiliere(e.target.value)}
                        placeholder={
                          isFr
                            ? 'Ex: Études Amazighes, Droit, Économie, Lettres, Informatique...'
                            : 'اكتب شعبتك بالتحديد (مثال: دراسات أمازيغية، قانون، علوم اقتصادية، إعلاميات...)'
                        }
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>

                    {/* Right column field: المستوى الدراسي الجامعي * */}
                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {isFr ? 'Niveau Universitaire *' : 'المستوى الدراسي الجامعي *'}
                      </label>
                      <select
                        required
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] cursor-pointer"
                      >
                        <option value="">{isFr ? '-- Choisir l\'année universitaire --' : '-- اختر السنة الجامعية --'}</option>
                        {universityLevels.map((lvl) => (
                          <option key={lvl.id} value={lvl.id}>
                            {isFr ? lvl.labelFr : (isTm ? lvl.labelTm : lvl.labelAr)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. معلومات الاتصال والتواصل */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2 pb-1">
                    <Phone className="w-5 h-5 text-slate-600" />
                    <span>{isFr ? '3. Coordonnées' : '📞 3. معلومات الاتصال والتواصل'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Right column: رقم الهاتف * */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {isFr ? 'Téléphone (WhatsApp) *' : 'رقم الهاتف *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 XX XX XX XX"
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] text-slate-900 font-medium placeholder-slate-400"
                        dir="ltr"
                      />
                    </div>

                    {/* Left column: البريد الإلكتروني */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        {isFr ? 'Adresse E-mail' : 'البريد الإلكتروني'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-100/70 border-0 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] text-slate-900 font-medium placeholder-slate-400"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. الورشات ومجالات الاهتمام */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold text-[#1C3F3A] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B82B2B]" />
                    <span>{isFr ? '4. Ateliers et Centres d\'intérêt' : '4. الورشات ومجالات الاهتمام (اختياري)'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {interestOptions.map((opt) => {
                      const isSelected = interests.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleInterest(opt.id)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-right flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-[#1C3F3A] text-[#1C3F3A] shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>{isFr ? opt.labelFr : opt.labelAr}</span>
                          <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-[#1C3F3A] border-[#1C3F3A] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <span className="text-[10px]">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Area with Seal & Submit Button */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  <div className="w-full sm:w-auto flex items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-sm font-black py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>{isFr ? 'Confirmer l\'Adhésion' : 'تأكيد انخراط وتسجيل الطلب'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-5 py-4 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                    >
                      {isFr ? 'Annuler' : 'إلغاء'}
                    </button>
                  </div>

                  {/* Stamp on Bottom Right - Exact positioning as in document */}
                  <div className="flex items-center gap-2 shrink-0">
                    <OfficialStamp className="w-24 h-24 sm:w-28 sm:h-28" stampUrl={siteSettings.stampUrl} />
                  </div>

                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
