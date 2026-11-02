import React, { useState, useRef } from 'react';
import { 
  Search, 
  FileText, 
  FileDown, 
  Printer, 
  ImageIcon, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  MessageCircle,
  GraduationCap,
  KeyRound
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from './AmazighHeader';
import { SiteSettings, findMemberByCode } from '../lib/firebase';
import { Member } from '../types/bureau';
import { OfficialStamp } from './OfficialStamp';

interface ReceiptLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  siteSettings: SiteSettings;
  onOpenRegistration: () => void;
}

export const ReceiptLookupModal: React.FC<ReceiptLookupModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  siteSettings,
  onOpenRegistration
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundMember, setFoundMember] = useState<Member | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const clubLogo = siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
  const schoolLogo = siteSettings.schoolLogoUrl || '/assets/aistudio/image_e594bc88.png';

  const handleSearch = async (codeToSearch?: string) => {
    const query = (codeToSearch || searchCode).trim();
    if (!query) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const member = await findMemberByCode(query);
      if (member) {
        setFoundMember(member);
        setErrorMsg(null);
      } else {
        setFoundMember(null);
        setErrorMsg(
          isFr
            ? `Aucun membre trouvé avec l'identifiant "${query}". Veuillez vérifier le رقم الوصل، CIN ou Téléphone.`
            : `لم يتم العثور على أي منخرط مسجل بالرمز "${query}". يرجى التحقق من رقم الوصل، أو رقم البطاقة الوطنية (CIN)، أو رقم الهاتف.`
        );
      }
    } catch (err) {
      console.error('Search failed:', err);
      setErrorMsg(
        isFr
          ? 'Une erreur est survenue lors de la recherche. Veuillez réessayer.'
          : 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (receiptRef.current && foundMember) {
      try {
        const dataUrl = await toPng(receiptRef.current, {
          cacheBust: true,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          fontEmbedCSS: '',
        });
        const link = document.createElement('a');
        link.download = `Recu_Adhesion_${foundMember.id}_${foundMember.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image:', err);
      }
    }
  };

  const handleDownloadExcel = () => {
    if (!foundMember) return;
    const origin = window.location.origin;
    const absoluteClubLogo = clubLogo.startsWith('http') ? clubLogo : `${origin}${clubLogo}`;
    const absoluteSchoolLogo = schoolLogo.startsWith('http') ? schoolLogo : `${origin}${schoolLogo}`;
    const absoluteStamp = siteSettings.stampUrl || '/assets/aistudio/IMG_20261102_010400_c0845ab1.jpg';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(foundMember.id)}`;
    
    const receiptHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          .main-table { border-collapse: collapse; width: 520pt; border: 3pt solid #1C3F3A; margin: 20px auto; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
          .cell { border: 1pt solid #cbd5e1; padding: 10px; }
          .header-banner { background-color: #1C3F3A; text-align: center; color: #ffffff; padding: 14px; font-size: 18pt; font-weight: bold; }
          .label-cell { background-color: #f8fafc; font-weight: bold; color: #334155; text-align: right; width: 140pt; padding: 10px; border: 1pt solid #cbd5e1; font-size: 11pt; }
          .value-cell { color: #0f172a; font-weight: 800; text-align: right; padding: 10px; border: 1pt solid #cbd5e1; font-size: 11pt; }
          .section-divider { background-color: #f1f5f9; font-weight: 900; text-align: center; color: #1C3F3A; padding: 8px; border-top: 2pt solid #1C3F3A; border-bottom: 2pt solid #1C3F3A; font-size: 11pt; }
          .logo-container { text-align: center; padding: 12px; border-bottom: 1pt solid #1C3F3A; }
          .qr-container { text-align: center; padding: 15px; vertical-align: middle; border: 1pt solid #cbd5e1; }
          .stamp-area { text-align: center; vertical-align: middle; padding: 12px; border: 1pt solid #cbd5e1; }
          .id-badge { font-family: 'Courier New', monospace; color: #B82B2B; font-size: 15pt; font-weight: 900; letter-spacing: 1.5pt; }
          .valid-badge { color: #059669; font-size: 13pt; font-weight: 900; }
          .footer-banner { background-color: #1C3F3A; color: #ffffff; text-align: center; font-size: 10pt; padding: 10px; font-weight: bold; }
        </style>
      </head>
      <body dir="rtl">
        <table class="main-table">
          <tr>
            <td colspan="2" class="logo-container" style="width: 50%;">
              <img src="${absoluteClubLogo}" height="65" alt="Club Logo">
              <div style="font-size: 8.5pt; font-weight: bold; color: #1C3F3A; margin-top: 4pt;">${siteSettings.clubNameAr || 'نادي الثقافة الأمازيغية ببرشيد'}</div>
            </td>
            <td colspan="2" class="logo-container" style="width: 50%;">
              <img src="${absoluteSchoolLogo}" height="55" alt="School Logo">
              <div style="font-size: 8.5pt; font-weight: bold; color: #B82B2B; margin-top: 4pt;">ESEF BERRECHID - جامعة الحسن الأول</div>
            </td>
          </tr>
          <tr><th colspan="4" class="header-banner">استمارة الانخراط والتسجيل الرسمي في النادي</th></tr>
          <tr><td colspan="4" class="section-divider">1. البيانات الشخصية للمنخرط(ة)</td></tr>
          <tr>
            <td class="label-cell">الاسم واللقب الكامل:</td>
            <td class="value-cell" style="font-size: 13pt; color: #1C3F3A;">${foundMember.name}</td>
            <td class="label-cell">رقم البطاقة (CIN) / مسار:</td>
            <td class="value-cell">${foundMember.cin || '---'}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">2. المسار الجامعي والشعبة</td></tr>
          <tr>
            <td class="label-cell">الشعبة / المسلك الدراسي:</td>
            <td class="value-cell">${foundMember.filiere || '---'}</td>
            <td class="label-cell">المستوى الدراسي الجامعي:</td>
            <td class="value-cell">${foundMember.niveau || '---'}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">3. معلومات الاتصال والتواصل</td></tr>
          <tr>
            <td class="label-cell">رقم الهاتف:</td>
            <td class="value-cell" dir="ltr">${foundMember.phone || '---'}</td>
            <td class="label-cell">البريد الإلكتروني:</td>
            <td class="value-cell" dir="ltr">${foundMember.email || '---'}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">التعريف الرقمي والختم الرسمي</td></tr>
          <tr>
            <td rowspan="2" colspan="2" class="qr-container">
              <img src="${qrUrl}" width="110" height="110" alt="QR Code">
              <div style="font-size: 8pt; color: #64748b; margin-top: 4pt;">رمز العضوية (ID): <b style="color:#B82B2B">${foundMember.id}</b></div>
            </td>
            <td colspan="2" class="stamp-area">
              <img src="${absoluteStamp}" height="95" alt="Official Stamp">
              <div style="font-size: 8.5pt; font-weight: bold; color: #1C3F3A; margin-top: 4pt;">ختم وتوقيع إدارة النادي</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: center; vertical-align: middle; padding: 10px;">
              <div class="valid-badge">✅ وصل تسجيل مقبول ومحفوظ</div>
              <div style="color: #64748b; font-size: 8.5pt;">الموسم الجامعي 2026/2027</div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="footer-banner">
              ⵜⴰⵎⴰⵣⵉⵖⵜ · ⵜⵓⵙⵙⵏⴰ · ⵜⴰⵢⵙⵉ | ${siteSettings.clubNameAr || 'نادي الثقافة الأمازيغية ببرشيد'}
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + receiptHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recu_Adhesion_${foundMember.id}_${foundMember.name.replace(/\s+/g, '_')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1C3F3A] via-[#163631] to-[#0d221f] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {isFr ? 'Télécharger le Reçu d\'Inscription' : (isTm ? 'ⴰⴳⵎ ⵏ ⵓⵙⵍⴽⵉⵏ ⵏ ⵓⵣⵎⵎⴻⵎ' : 'تحميل وصل التسجيل والاستمارة الرسمية')}
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200/80">
                {isFr
                  ? 'Entrez votre code membre ou CIN pour récupérer votre reçu officiel'
                  : 'أدخل رقم العضوية أو رقم البطاقة الوطنية أو الهاتف لاستخراج استمارة وصلك'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
            dir="rtl"
          >
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder={isFr ? 'N° d\'adhésion, CIN, Téléphone ou Nom...' : 'أدخل رقم العضوية (ID) أو CIN أو رقم الهاتف...'}
                className="w-full text-xs sm:text-sm p-3.5 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white shadow-inner font-mono font-bold text-slate-900"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="px-6 py-3.5 rounded-xl bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-amber-300" />
              )}
              <span>{isFr ? 'Rechercher' : 'بحث وتحميل الاستمارة'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5" dir="rtl">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegistration();
                  }}
                  className="mt-2 text-emerald-700 hover:text-emerald-800 font-bold underline text-[11px] block"
                >
                  {isFr ? 'Remplir le formulaire d\'adhésion maintenant →' : 'تقديم طلب انخراط جديد الآن ←'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Member Receipt Result Container */}
        {foundMember && (
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5 animate-fade-in text-right" dir="rtl">
            
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم العثور على وصل العضوية بنجاح: {foundMember.name}</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                {foundMember.id}
              </span>
            </div>

            {/* Official Document Card */}
            <div 
              ref={receiptRef} 
              className="bg-white rounded-2xl p-5 sm:p-7 shadow-lg border-2 border-slate-200 relative overflow-hidden flex flex-col gap-4 text-slate-900"
            >
              {/* Header Logos */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <img 
                  src={clubLogo} 
                  alt="Club Logo" 
                  className="h-12 sm:h-16 w-auto object-contain mix-blend-multiply"
                />
                <div className="text-center flex-1">
                  <span className="text-[9px] font-black text-[#B82B2B] block uppercase tracking-tighter">المملكة المغربية · ROYAUME DU MAROC</span>
                  <span className="text-xs sm:text-sm font-black text-[#1C3F3A] block">{siteSettings.clubNameAr || 'نادي الثقافة الأمازيغية ببرشيد'}</span>
                  <span className="text-[9px] text-slate-500 font-bold block">ESEF Berrechid - جامعة الحسن الأول</span>
                </div>
                <img 
                  src={schoolLogo} 
                  alt="School Logo" 
                  className="h-10 sm:h-14 w-auto object-contain mix-blend-multiply"
                />
              </div>

              {/* Banner Title */}
              <div className="bg-[#1C3F3A] text-white text-center py-2 px-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-300">{foundMember.id}</span>
                <span className="text-xs sm:text-sm font-black">استمارة الانخراط والتسجيل الرسمي في النادي</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">2026/2027</span>
              </div>

              {/* QR Code and Identification Banner */}
              <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1 shrink-0 shadow-inner">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(foundMember.id)}`} 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">رقم الوصل ورمز العضوية</span>
                  <span className="text-base font-black text-[#1C3F3A] font-mono tracking-widest">{foundMember.id}</span>
                  <div className="text-[11px] text-slate-600 flex items-center gap-2 pt-0.5">
                    <span>تاريخ التسجيل: {foundMember.registeredDate || new Date().toLocaleDateString('ar-MA')}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">عضوية مسجلة بالنظام</span>
                  </div>
                </div>
              </div>

              {/* 3 Numbered Sections (Filled) */}
              <div className="space-y-4">
                
                {/* Section 1 */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <h4 className="text-xs font-extrabold text-[#1C3F3A] mb-2 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <User className="w-3.5 h-3.5 text-[#B82B2B]" />
                    <span>1. البيانات الشخصية للمنخرط(ة)</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">الاسم واللقب الكامل:</span>
                      <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block truncate">{foundMember.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">رقم البطاقة (CIN) / مسار:</span>
                      <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block">{foundMember.cin || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <h4 className="text-xs font-extrabold text-[#1C3F3A] mb-2 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <GraduationCap className="w-3.5 h-3.5 text-[#B82B2B]" />
                    <span>2. المسار الجامعي والشعبة</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">الشعبة / المسلك الدراسي:</span>
                      <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block truncate">{foundMember.filiere || '---'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">المستوى الدراسي الجامعي:</span>
                      <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block">{foundMember.niveau || '---'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                  <h4 className="text-xs font-extrabold text-[#1C3F3A] mb-2 flex items-center gap-1.5 pb-1 border-b border-slate-200">
                    <Phone className="w-3.5 h-3.5 text-[#B82B2B]" />
                    <span>3. معلومات الاتصال والتواصل</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">رقم الهاتف:</span>
                      <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block" dir="ltr">{foundMember.phone || '---'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block mb-0.5">البريد الإلكتروني:</span>
                      <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block truncate" dir="ltr">{foundMember.email || '---'}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Stamp & Signature Area */}
              <div className="pt-3 border-t-2 border-dashed border-slate-200 flex items-center justify-between relative min-h-[90px]">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block w-fit">
                    ✅ وصل تسجيل معتمد ومصادق عليه
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">الموسم الجامعي 2026/2027 · ESEF Berrechid</span>
                </div>

                {/* Stamp */}
                <div className="pr-2">
                  <OfficialStamp className="w-24 h-24 sm:w-26 sm:h-26" stampUrl={siteSettings.stampUrl} />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                <span>تحميل كصورة (PNG)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadExcel}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>تحميل الوصل (Excel)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{isFr ? 'Imprimer / PDF' : 'طباعة أو حفظ PDF'}</span>
              </button>

              {siteSettings.whatsappNumber && (
                <a
                  href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `السلام عليكم، أنا المنخرط(ة) ${foundMember.name}، رقم وصلي هو ${foundMember.id}. أود تأكيد تسجيلي بنادي الثقافة الأمازيغية ببرشيد.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>تأكيد عبر واتساب</span>
                </a>
              )}
            </div>

          </div>
        )}

        <div className="bg-slate-100 p-4 text-center border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>{siteSettings.clubNameAr || 'نادي الثقافة الأمازيغية ببرشيد'}</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-lg"
          >
            {isFr ? 'Fermer' : 'إغلاق'}
          </button>
        </div>

      </div>
    </div>
  );
};
