import React, { useState, useRef } from 'react';
import {
  X,
  Search,
  FileText,
  Image as ImageIcon,
  Printer,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  GraduationCap,
  MessageCircle,
  KeyRound
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Language } from './AmazighHeader';
import { Member } from '../types/bureau';
import { SiteSettings } from '../lib/firebase';
import { OfficialStamp } from './OfficialStamp';

interface DownloadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  siteSettings: SiteSettings;
  members: Member[];
  onOpenRegister?: () => void;
}

export const DownloadReceiptModal: React.FC<DownloadReceiptModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  siteSettings,
  members,
  onOpenRegister,
}) => {
  const [searchId, setSearchId] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const receiptCardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const clubLogo = siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
  const schoolLogo = siteSettings.schoolLogoUrl || '/assets/aistudio/image_e594bc88.png';

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchId.trim();
    if (!query) return;

    setHasSearched(true);

    const normalizedQuery = query.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const cleanQ = normalizedQuery.toUpperCase().trim();
    const cleanAlphanum = cleanQ.replace(/[^A-Z0-9]/g, '');
    const digitsOnly = normalizedQuery.replace(/\D/g, '');

    const found = members.find((m) => {
      const mId = (m.id || '').toUpperCase();
      const mIdClean = mId.replace(/[^A-Z0-9]/g, '');
      const mIdDigits = mId.replace(/\D/g, '');

      if (mId === cleanQ || mIdClean === cleanAlphanum) return true;
      if (cleanQ.length >= 3 && mId.includes(cleanQ)) return true;
      if (digitsOnly.length >= 3 && (mIdDigits.endsWith(digitsOnly) || mIdDigits.includes(digitsOnly))) return true;

      if (m.cin) {
        const cleanCin = m.cin.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (cleanCin === cleanAlphanum || cleanCin === cleanQ) return true;
      }

      if (m.phone && digitsOnly.length >= 6) {
        const phoneDigits = m.phone.replace(/\D/g, '');
        if (phoneDigits.includes(digitsOnly)) return true;
      }

      if (m.name && m.name.toLowerCase().includes(query.toLowerCase())) return true;

      return false;
    });

    if (found) {
      setSelectedMember(found);
      downloadExcel(found);
    } else {
      setSelectedMember(null);
    }
  };

  const downloadExcel = (member: Member) => {
    const origin = window.location.origin;
    const absoluteClubLogo = clubLogo.startsWith('http') ? clubLogo : `${origin}${clubLogo}`;
    const absoluteSchoolLogo = schoolLogo.startsWith('http') ? schoolLogo : `${origin}${schoolLogo}`;
    const absoluteStamp = siteSettings.stampUrl || '/assets/aistudio/IMG_20261102_010400_c0845ab1.jpg';
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(member.id)}`;

    const excelHtml = `
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
            <td class="value-cell" style="font-size: 13pt; color: #1C3F3A;">${member.name}</td>
            <td class="label-cell">رقم البطاقة (CIN) / مسار:</td>
            <td class="value-cell">${member.cin || '---'}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">2. المسار الجامعي والشعبة</td></tr>
          <tr>
            <td class="label-cell">الشعبة / المسلك الدراسي:</td>
            <td class="value-cell">${member.filiere}</td>
            <td class="label-cell">المستوى الدراسي الجامعي:</td>
            <td class="value-cell">${member.niveau}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">3. معلومات الاتصال والتواصل</td></tr>
          <tr>
            <td class="label-cell">رقم الهاتف:</td>
            <td class="value-cell" dir="ltr">${member.phone}</td>
            <td class="label-cell">البريد الإلكتروني:</td>
            <td class="value-cell" dir="ltr">${member.email || '---'}</td>
          </tr>
          <tr><td colspan="4" class="section-divider">التعريف الرقمي والختم الرسمي</td></tr>
          <tr>
            <td rowspan="2" colspan="2" class="qr-container">
              <img src="${qrUrl}" width="110" height="110" alt="QR Code">
              <div style="font-size: 8pt; color: #64748b; margin-top: 4pt;">رمز العضوية (ID): <b style="color:#B82B2B">${member.id}</b></div>
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

    const blob = new Blob(['\uFEFF' + excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recu_Adhesion_${member.id}_${member.name.replace(/\s+/g, '_')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImage = async () => {
    if (!receiptCardRef.current || !selectedMember) return;
    try {
      const dataUrl = await toPng(receiptCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `Recu_${selectedMember.id}_${selectedMember.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Image capture error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl my-auto overflow-hidden text-slate-800">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1C3F3A] to-[#285750] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                {isFr ? 'Télécharger le Reçu d\'Adhésion' : (isTm ? 'ⴰⴳⵎ ⵏ ⵜⴼⵔⵜ ⵏ ⵓⴽⵛⴰⵎ' : 'تحميل وصل واستمارة التسجيل الرسمية')}
              </h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                {isFr
                  ? 'Entrez votre code d\'adhérent pour récupérer votre reçu officiel'
                  : 'أدخل رقم العضوية الخاص بك لتحميل الوصل الرسمي مباشرة'}
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5" dir="rtl">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={isFr ? 'Code membre, CIN ou Téléphone...' : 'أدخل رقم العضوية (ID) أو CIN أو رقم الهاتف...'}
                className="w-full text-xs sm:text-sm p-3.5 pr-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white font-mono font-bold text-slate-900"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={!searchId.trim()}
              className="px-6 py-3.5 rounded-xl bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 shrink-0"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>{isFr ? 'Rechercher' : 'بحث وتحميل الاستمارة'}</span>
            </button>
          </form>

          {/* If search performed but no result */}
          {hasSearched && !selectedMember && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-start gap-3" dir="rtl">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">
                  {isFr ? 'Aucun reçu trouvé avec ce code.' : `لم يتم العثور على أي وصل مسجل بالرمز "${searchId}".`}
                </p>
                <p className="text-amber-800">
                  يرجى التأكد من كتابة رمز العضوية بشكل صحيح (مثال: CCAB-2026-1021)، أو إدخال رقم CIN أو رقم الهاتف.
                </p>
                {onOpenRegister && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRegister();
                    }}
                    className="mt-2 text-emerald-700 hover:text-emerald-800 font-bold underline text-[11px] block"
                  >
                    تقديم طلب انخراط جديد الآن ←
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Member Card & Printable/Exportable Document Layout */}
          {selectedMember && (
            <div className="space-y-4 animate-fade-in text-right" dir="rtl">
              
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تم العثور على الوصل الرسمي وحفظه تلقائياً!</span>
                </div>
                <span className="font-mono text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                  {selectedMember.id}
                </span>
              </div>

              <div
                ref={receiptCardRef}
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

                {/* Document Banner Title */}
                <div className="bg-[#1C3F3A] text-white text-center py-2 px-3 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-300">{selectedMember.id}</span>
                  <span className="text-xs sm:text-sm font-black">استمارة الانخراط والتسجيل الرسمي في النادي</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">2026/2027</span>
                </div>

                {/* QR Code and Identification Banner */}
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg flex items-center justify-center p-1 shrink-0 shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedMember.id)}`} 
                      alt="QR Code" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">رقم الوصل ورمز العضوية</span>
                    <span className="text-base font-black text-[#1C3F3A] font-mono tracking-widest">{selectedMember.id}</span>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2 pt-0.5">
                      <span>تاريخ التسجيل: {selectedMember.registeredDate || '2026-10-24'}</span>
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
                        <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block truncate">{selectedMember.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-0.5">رقم البطاقة (CIN) / مسار:</span>
                        <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block">{selectedMember.cin || '---'}</span>
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
                        <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block truncate">{selectedMember.filiere || '---'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-0.5">المستوى الدراسي الجامعي:</span>
                        <span className="font-bold text-slate-900 bg-white p-2 rounded-lg border border-slate-200 block">{selectedMember.niveau || '---'}</span>
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
                        <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block" dir="ltr">{selectedMember.phone || '---'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block mb-0.5">البريد الإلكتروني:</span>
                        <span className="font-bold text-slate-900 font-mono bg-white p-2 rounded-lg border border-slate-200 block truncate" dir="ltr">{selectedMember.email || '---'}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Seal & Signature */}
                <div className="pt-3 border-t-2 border-dashed border-slate-200 flex items-center justify-between relative min-h-[90px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block w-fit">
                      ✅ وصل تسجيل معتمد ومصادق عليه
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold">الموسم الجامعي 2026/2027 · ESEF Berrechid</span>
                  </div>

                  {/* Official Circular Stamp */}
                  <div className="pr-2">
                    <OfficialStamp className="w-24 h-24 sm:w-26 sm:h-26" stampUrl={siteSettings.stampUrl} />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => downloadExcel(selectedMember)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>تحميل الوصل (Excel)</span>
                </button>

                <button
                  type="button"
                  onClick={downloadImage}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>تحميل كصورة (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isFr ? 'Imprimer / PDF' : 'طباعة أو حفظ PDF'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
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
