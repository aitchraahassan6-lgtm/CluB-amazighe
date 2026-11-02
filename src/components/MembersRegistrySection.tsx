import React, { useState, useMemo, useRef } from 'react';
import { Member } from '../types/bureau';
import { toPng } from 'html-to-image';
import { Language } from './AmazighHeader';
import { SiteSettings } from '../lib/firebase';
import { MOCK_MEMBER_IDS, MOCK_MEMBER_NAMES } from '../data/bureauData';
import {
  UserPlus,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  Phone,
  GraduationCap,
  Trash2,
  Printer,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building2,
  Calendar,
  X,
  BadgeCheck,
  Plus,
  FileText,
  ImageIcon
} from 'lucide-react';

interface MembersRegistrySectionProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onRecordFeeToTreasury?: (memberName: string, amount: number) => void;
  currentLang: Language;
  siteSettings: SiteSettings;
}

export const MembersRegistrySection: React.FC<MembersRegistrySectionProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onRecordFeeToTreasury,
  currentLang,
  siteSettings,
}) => {
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Quick form toggle & states
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [cin, setCin] = useState('');
  const [filiere, setFiliere] = useState('');
  const [niveau, setNiveau] = useState('السنة الأولى جامعي (L1)');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [feeAmount, setFeeAmount] = useState('50');
  const [feePaid, setFeePaid] = useState(true);
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (receiptRef.current) {
      try {
        const dataUrl = await toPng(receiptRef.current, {
          cacheBust: true,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          fontEmbedCSS: '', // Avoid SecurityError with external fonts
        });
        const link = document.createElement('a');
        link.download = `CCAB_Admin_Receipt_${selectedMember?.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image:', err);
      }
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Clean valid members (filter out any mock test members)
  const validMembers = useMemo(() => {
    return members.filter((m) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name));
  }, [members]);

  // KPIs
  const totalMembers = validMembers.length;
  const paidMembers = validMembers.filter((m) => m.feePaid);
  const pendingMembers = validMembers.filter((m) => !m.feePaid);
  const totalFeesCollected = paidMembers.reduce((acc, m) => acc + m.feeAmount, 0);
  const totalFeesPending = pendingMembers.reduce((acc, m) => acc + m.feeAmount, 0);
  const collectionRate = totalMembers > 0 ? Math.round((paidMembers.length / totalMembers) * 100) : 0;

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return validMembers.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.cin && m.cin.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm);

      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'paid'
            ? m.feePaid
            : !m.feePaid;

      return matchSearch && matchStatus;
    });
  }, [validMembers, searchTerm, statusFilter]);

  // Handle Submit New Member
  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !filiere.trim()) return;

    const parsedFee = parseFloat(feeAmount) || 50;
    const now = new Date().toISOString().split('T')[0];

    const newMember: Member = {
      id: `CCAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      cin: cin.trim() || '',
      filiere: filiere.trim(),
      niveau,
      phone: phone.trim() || '---',
      email: email.trim() || '',
      feeAmount: parsedFee,
      feePaid,
      paidDate: feePaid ? now : '',
      registeredDate: now,
      notes: notes.trim() || '',
      registrationSource: 'treasurer',
      approvalStatus: 'approved', // Manually added members are auto-approved
    };

    onAddMember(newMember);

    // If paid, optionally add transaction to treasury
    if (feePaid && onRecordFeeToTreasury) {
      onRecordFeeToTreasury(newMember.name, parsedFee);
    }

    showNotification(
      isFr
        ? 'Nouvel adhérent enregistré avec succès !'
        : 'تم تسجيل المنخرط وتوثيق واجب الانخراط بنجاح!'
    );

    // Reset Form
    setName('');
    setCin('');
    setFiliere('');
    setPhone('');
    setEmail('');
    setNotes('');
    setShowAddForm(false);
  };

  // Approval Status Handler
  const handleApprovalStatus = (m: Member, status: 'approved' | 'rejected') => {
    const updatedMember: Member = {
      ...m,
      approvalStatus: status,
    };
    onUpdateMember(updatedMember);
    showNotification(
      status === 'approved'
        ? (isFr ? 'Inscription approuvée !' : `تمت الموافقة على طلب المنخرط ${m.name} بنجاح!`)
        : (isFr ? 'Inscription refusée.' : `تم رفض طلب المنخرط ${m.name}.`)
    );
  };

  // Toggle Fee Payment status
  const handleToggleFeeStatus = (m: Member) => {
    const updatedStatus = !m.feePaid;
    const now = new Date().toISOString().split('T')[0];
    const updatedMember: Member = {
      ...m,
      feePaid: updatedStatus,
      paidDate: updatedStatus ? now : '',
      // If payment is confirmed, we usually auto-approve
      approvalStatus: updatedStatus ? 'approved' : m.approvalStatus,
    };

    onUpdateMember(updatedMember);

    if (updatedStatus && onRecordFeeToTreasury) {
      onRecordFeeToTreasury(m.name, m.feeAmount);
    }

    showNotification(
      updatedStatus
        ? (isFr ? 'Cotisation marquée comme Payée (+50 MAD) !' : `تم تأكيد أداء واجب الانخراط للمنخرط(ة) ${m.name} بنجاح!`)
        : (isFr ? 'Cotisation marquée comme En attente.' : `تم تحويل حالة واجب الانخراط إلى قيد الانتظار.`)
    );
  };

  const universityLevels = [
    'السنة الأولى جامعي (L1)',
    'السنة الثانية جامعي (L2)',
    'السنة الثالثة جامعي - الإجازة (L3)',
    'الماستر / دراسات عليا',
  ];

  return (
    <div className="space-y-4 animate-fade-in text-start text-xs sm:text-sm">
      
      {/* Top Officer Header & Action - Compact */}
      <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#1C3F3A] to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0 border border-white/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
                {isFr ? 'Portail des Adhérents & Inscriptions' : 'بوابة المنخرطين وسجل واجبات الانخراط'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">
                {isFr ? 'Gestion Trésorier' : 'إدارة الأمين'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isFr
                ? 'Gestion des fiches membres, suivi des cotisations et enregistrement'
                : 'تسجيل المنخرطين الجدد، ضبط واجب الانخراط وحفظ البيانات مركزياً'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            {showAddForm ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? (isFr ? 'Fermer le formulaire' : 'إخفاء الاستمارة') : (isFr ? 'Ajouter Adhérent' : 'إدخال منخرط جديد')}</span>
          </button>

          <button
            onClick={() => {
              const tableHTML = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; }
                    .main-header { background-color: #1C3F3A; color: #ffffff; text-align: center; font-size: 18pt; font-weight: bold; padding: 20px; }
                    .sub-header { background-color: #f1f5f9; color: #475569; text-align: center; font-size: 10pt; padding: 10px; border-bottom: 2pt solid #1C3F3A; }
                    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
                    th { background-color: #1C3F3A; color: #FFD700; border: 1pt solid #0f172a; padding: 12px; text-align: center; font-weight: bold; font-size: 11pt; }
                    td { border: 1pt solid #cbd5e1; padding: 8px 10px; text-align: center; font-size: 10pt; }
                    .row-even { background-color: #f8fafc; }
                    .name-cell { text-align: right; font-weight: bold; color: #1e293b; }
                    .paid { background-color: #d1fae5; color: #065f46; font-weight: bold; }
                    .pending { background-color: #fef3c7; color: #92400e; font-weight: bold; }
                    .id-cell { font-family: monospace; color: #B82B2B; font-weight: bold; }
                    .footer { background-color: #1C3F3A; color: #ffffff; text-align: center; font-size: 9pt; padding: 15px; margin-top: 20px; }
                  </style>
                </head>
                <body dir="rtl">
                  <div class="main-header">${siteSettings.clubNameAr} - السجل العام للمنخرطين</div>
                  <div class="sub-header">تاريخ التصدير: ${new Date().toLocaleDateString('ar-MA')} | إجمالي المنخرطين في هذه القائمة: ${filteredMembers.length}</div>
                  <table>
                    <thead>
                      <tr>
                        <th>رقم العضوية</th>
                        <th>الاسم الكامل</th>
                        <th>البطاقة الوطنية</th>
                        <th>الشعبة / التخصص</th>
                        <th>المستوى الجامعي</th>
                        <th>رقم الهاتف</th>
                        <th>البريد الإلكتروني</th>
                        <th>الواجب (MAD)</th>
                        <th>حالة الأداء</th>
                        <th>تاريخ التسجيل</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredMembers.map((m, idx) => `
                        <tr class="${idx % 2 === 0 ? '' : 'row-even'}">
                          <td class="id-cell">${m.id}</td>
                          <td class="name-cell">${m.name}</td>
                          <td>${m.cin || '---'}</td>
                          <td>${m.filiere}</td>
                          <td>${m.niveau}</td>
                          <td dir="ltr">${m.phone}</td>
                          <td dir="ltr">${m.email || '---'}</td>
                          <td style="font-weight: 800;">${m.feeAmount}</td>
                          <td class="${m.feePaid ? 'paid' : 'pending'}">${m.feePaid ? 'مؤدى ✅' : 'قيد الانتظار ⏳'}</td>
                          <td>${m.registeredDate}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                  <div class="footer">
                    ⵜⴰⵎⴰⵣⵉⵖⵜ · ⵜⵓⵙⵙⵏⴰ · ⵜⴰⵢⵙⵉ | ${siteSettings.clubNameAr}
                  </div>
                </body>
                </html>
              `;

              const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `CCAB_Registry_${new Date().toISOString().split('T')[0]}.xls`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
            title="تحميل لائحة المنخرطين إكسل ملونة ومنظمة"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFr ? 'Excel Coloré (.xls)' : 'تحميل إكسل ملون'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
            title="طباعة اللائحة"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFr ? 'Imprimer' : 'طباعة اللائحة'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* COMPACT 4 MINI-KPI STATS (تصغير الحجم لظهور أحسن) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* Total Members */}
        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isFr ? 'Total Adhérents' : 'إجمالي المنخرطين'}
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {totalMembers} <span className="text-[10px] font-normal text-slate-500">{isFr ? 'membres' : 'منخرط'}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* Paid Membership Fees */}
        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isFr ? 'Cotisations Payées' : 'أدوا واجب الانخراط'}
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-700 leading-tight">
              {paidMembers.length} <span className="text-[10px] font-normal text-emerald-600">({totalFeesCollected} د.م)</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* Pending Membership Fees */}
        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isFr ? 'En Attente' : 'قيد انتظار الواجب'}
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-700 leading-tight">
              {pendingMembers.length} <span className="text-[10px] font-normal text-amber-600">({totalFeesPending} د.م)</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Collection Rate */}
        <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              {isFr ? 'Taux de Recouvrement' : 'نسبة الاستخلاص'}
            </span>
            <div className="text-lg sm:text-xl font-black text-[#1C3F3A] leading-tight">
              {collectionRate}%
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#1C3F3A] flex items-center justify-center font-bold text-xs font-mono">
            %
          </div>
        </div>

      </div>

      {/* COMPACT ADD MEMBER FORM (يتم إدخالها من قبل الأمين) */}
      {showAddForm && (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-300 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
              <UserPlus className="w-4 h-4 text-[#1C3F3A]" />
              <span>{isFr ? 'Formulaire d\'Ajout d\'un Adhérent (Par l\'Amine)' : 'استمارة إدخال منخرط جديد وضبط واجب الانخراط'}</span>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmitMember} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Nom complet de l\'adhérent *' : 'الاسم الكامل للمنخرط(ة) *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: يونس أكناو"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white"
              />
            </div>

            {/* CIN */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'CIN (Optionnel)' : 'رقم البطاقة الوطنية (اختياري)'}
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Ex: BK123456"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white font-mono uppercase"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Téléphone *' : 'رقم الهاتف *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 XX XX XX XX"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white font-mono"
              />
            </div>

            {/* Filière / Major */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Filière / Spécialité *' : 'الشعبة / التخصص *'}
              </label>
              <input
                type="text"
                required
                value={filiere}
                onChange={(e) => setFiliere(e.target.value)}
                placeholder="مثال: الدراسات الأمازيغية، الاقتصاد..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white"
              />
            </div>

            {/* Level */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Niveau Universitaire' : 'المستوى الجامعي'}
              </label>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
              >
                {universityLevels.map((lvl, idx) => (
                  <option key={idx} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Email (Optionnel)' : 'البريد الإلكتروني (اختياري)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-white"
              />
            </div>

            {/* Membership Fee (واجب الانخراط) */}
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Cotisation / الواجب (MAD) *' : 'واجب الانخراط (بالدرهم) *'}
              </label>
              <input
                type="number"
                min="0"
                step="5"
                required
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
              />
            </div>

            {/* Fee Payment Status Toggle */}
            <div className="sm:col-span-2 md:col-span-2 flex items-center justify-between p-2 rounded-lg bg-white border border-slate-300 self-end">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1C3F3A]" />
                <span className="text-xs font-bold text-slate-800">
                  {feePaid ? 'تم أداء واجب الانخراط (مؤدى ✅)' : 'واجب الانخراط قيد الانتظار ⏳'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFeePaid(!feePaid)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  feePaid ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {feePaid ? 'مؤدى' : 'غير مؤدى'}
              </button>
            </div>

            {/* Submit button */}
            <div className="sm:col-span-2 md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1C3F3A] hover:bg-[#142e2a] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <BadgeCheck className="w-4 h-4" />
                <span>{isFr ? 'Enregistrer l\'Adhérent' : 'حفظ وتسجيل المنخرط في السجل الرسمي'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* SEARCH & FILTERS BAR - COMPACT */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute right-2.5 rtl:right-auto rtl:left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isFr ? 'Rechercher nom, filière, CIN...' : 'بحث بالاسم، الشعبة، رقم الهاتف...'}
            className="w-full text-xs p-2 pl-8 pr-8 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1C3F3A]"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 hidden sm:flex">
            <Filter className="w-3 h-3" />
            <span>الحالة:</span>
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-[#1C3F3A] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({validMembers.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              statusFilter === 'paid'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            مؤدى ({paidMembers.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            في الانتظار ({pendingMembers.length})
          </button>
        </div>

      </div>

      {/* COMPACT MEMBERS TABLE (Desktop) & STREAMLINED CARDS (Mobile) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table View (for desktop and tablets) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <th className="p-2.5 text-start">رقم المنخرط</th>
                <th className="p-2.5 text-start">الاسم والنسب</th>
                <th className="p-2.5 text-start">الشعبة / التخصص</th>
                <th className="p-2.5 text-start">المستوى</th>
                <th className="p-2.5 text-start">الهاتف</th>
                <th className="p-2.5 text-center">واجب الانخراط</th>
                <th className="p-2.5 text-center">حالة الأداء</th>
                <th className="p-2.5 text-center">المصادقة</th>
                <th className="p-2.5 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {m.id}
                  </td>
                  <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>{m.name}</span>
                      {m.cin && (
                        <span className="text-[10px] text-slate-400 font-mono">({m.cin})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2.5 text-slate-700 whitespace-nowrap">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                      {m.filiere}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600 text-[11px] whitespace-nowrap">
                    {m.niveau}
                  </td>
                  <td className="p-2.5 font-mono text-slate-600 whitespace-nowrap">
                    {m.phone}
                  </td>
                  <td className="p-2.5 text-center font-bold font-mono text-slate-900 whitespace-nowrap">
                    {m.feeAmount} د.م
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeeStatus(m)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-xs ${
                        m.feePaid
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="انقر لتغيير حالة أداء واجب الانخراط"
                    >
                      {m.feePaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{m.feePaid ? 'مؤدى' : 'غير مؤدى'}</span>
                    </button>
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {m.approvalStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                          <BadgeCheck className="w-3 h-3" />
                          مصدق
                        </span>
                      ) : m.approvalStatus === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                          <X className="w-3 h-3" />
                          مرفوض
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApprovalStatus(m, 'approved')}
                            className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                            title="الموافقة على الطلب"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleApprovalStatus(m, 'rejected')}
                            className="p-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                            title="رفض الطلب"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedMember(m)}
                        className="px-2 py-1 rounded text-[11px] font-bold text-[#1C3F3A] hover:bg-emerald-50"
                        title="معاينة بطاقة المنخرط"
                      >
                        بطاقة
                      </button>
                      <button
                        onClick={() => onDeleteMember(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Compact Cards (for seamless small screen rendering) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredMembers.map((m) => (
            <div key={m.id} className="p-3 space-y-2 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {m.name}
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>{m.id}</span>
                    {m.approvalStatus === 'approved' ? (
                      <span className="text-blue-600 font-bold flex items-center gap-0.5">
                        <BadgeCheck className="w-3 h-3" />
                        مصدق
                      </span>
                    ) : m.approvalStatus === 'rejected' ? (
                      <span className="text-rose-600 font-bold">مرفوض</span>
                    ) : (
                      <span className="text-amber-600 font-bold">انتظار المصادقة</span>
                    )}
                  </div>
                </div>

                {/* Status Toggle on Mobile */}
                <button
                  onClick={() => handleToggleFeeStatus(m)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    m.feePaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {m.feePaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  <span>{m.feePaid ? 'مؤدى' : 'غير مؤدى'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                  {m.filiere}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-mono">{m.phone}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[11px]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMember(m)}
                    className="text-[#1C3F3A] font-bold hover:underline"
                  >
                    البطاقة
                  </button>
                  
                  {m.approvalStatus === 'pending' && (
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-2">
                      <button 
                        onClick={() => handleApprovalStatus(m, 'approved')}
                        className="text-blue-600 font-bold"
                      >
                        قبول
                      </button>
                      <button 
                        onClick={() => handleApprovalStatus(m, 'rejected')}
                        className="text-rose-600 font-bold"
                      >
                        رفض
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteMember(m.id)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد سجلات مطابقة للبحث أو التصفية الحالية.
          </div>
        )}

      </div>

      {/* MEMBER CARD MODAL PREVIEW */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-start relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-3 left-3 text-slate-400 hover:text-slate-800 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Official Member Card / Receipt Design - Synced with RegistrationView (طويل مع الشعارات) */}
            <div ref={receiptRef} className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-slate-100 relative overflow-hidden flex flex-col gap-6 min-h-[500px]">
              
              {/* TOP HEADER: BOTH LOGOS */}
              <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-slate-50">
                {siteSettings.clubLogoUrl ? (
                  <img 
                    src={siteSettings.clubLogoUrl} 
                    alt="Club Logo" 
                    className="h-12 sm:h-16 w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="h-12 sm:h-16 w-12 sm:w-16 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] text-slate-400">Logo</div>
                )}
                <div className="text-center flex-1">
                  <span className="text-[9px] font-black text-[#B82B2B] block uppercase tracking-tighter">Royaume du Maroc</span>
                  <span className="text-[10px] font-bold text-[#1C3F3A] block">{siteSettings.clubNameAr}</span>
                </div>
                {siteSettings.schoolLogoUrl ? (
                  <img 
                    src={siteSettings.schoolLogoUrl} 
                    alt="School Logo" 
                    className="h-10 sm:h-14 w-auto object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="h-10 sm:h-14 w-10 sm:w-14 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] text-slate-400">Logo</div>
                )}
              </div>

              {/* CENTER: SCAN & RECEIPT NUMBER */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="w-24 h-24 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center mb-3 shadow-inner p-2">
                   <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedMember.id}`} 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                   />
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">N° ADHÉRENT / رقم المنخرط</span>
                  <span className="text-base font-black text-[#1C3F3A] font-mono tracking-widest">{selectedMember.id}</span>
                </div>
              </div>

              {/* INFO SECTION */}
              <div className="flex-1 space-y-4 pt-2">
                <div className="space-y-3">
                  <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">الاسم واللقب / Nom Complet</span>
                    <div className="text-base font-black text-slate-900">{selectedMember.name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[9px] text-slate-400 font-bold block">الشعبة / Filière</span>
                      <span className="text-xs font-bold text-slate-700 truncate block">{selectedMember.filiere}</span>
                    </div>
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[9px] text-slate-400 font-bold block">المستوى / Niveau</span>
                      <span className="text-xs font-bold text-slate-700 block">{selectedMember.niveau}</span>
                    </div>
                    
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[9px] text-slate-400 font-bold block">رقم البطاقة / CIN</span>
                      <span className="text-xs font-bold text-slate-700 block font-mono">{selectedMember.cin || '---'}</span>
                    </div>
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[9px] text-slate-400 font-bold block">الهاتف / Tél</span>
                      <span className="text-xs font-bold text-slate-700 block font-mono">{selectedMember.phone}</span>
                    </div>
                  </div>

                  {selectedMember.email && (
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[9px] text-slate-400 font-bold block">البريد الإلكتروني / Email</span>
                      <span className="text-xs font-bold text-slate-600 block">{selectedMember.email}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                    <span>تاريخ التسجيل: {selectedMember.registeredDate}</span>
                    <span>Berrechid, Morocco</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM FOOTER: STAMP & VALIDATION */}
              <div className="pt-6 mt-4 border-t-2 border-dashed border-slate-100 flex items-end justify-between relative min-h-[80px]">
                <div className="flex flex-col gap-1 pb-2">
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg border inline-block w-fit ${
                    selectedMember.feePaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {selectedMember.feePaid ? 'الواجب: مؤدى ✅' : 'الواجب: في الانتظار ⏳'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saison 2026/2027</span>
                </div>

                <div className="text-start pr-4 pb-2">
                   <span className="text-[9px] text-slate-300 font-mono">ⵜⴰⵎⴰⵣⵉⵖⵜ · ⵜⵓⵙⵙⵏⴰ</span>
                </div>
                
                {/* Official Club Stamp (الطابع الرسمي للنادي) */}
                {siteSettings.stampUrl && (
                  <div className="absolute -bottom-4 -right-4 opacity-95 pointer-events-none transform -rotate-12 scale-110">
                    <img 
                      src={siteSettings.stampUrl} 
                      alt="Stamp"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain brightness-110 contrast-125"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 no-print">
              <button
                onClick={handleDownloadImage}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>حفظ كصورة</span>
              </button>

              <button
                onClick={() => {
                  const origin = window.location.origin;
                  const clubLogoUrl = `${origin}/assets/aistudio/Capture_d__cran_2026-10-24_220552_169ba541.png`;
                  const schoolLogoUrl = `${origin}/assets/aistudio/image_e594bc88.png`;
                  const stampUrl = `${origin}/assets/aistudio/IMG_20261102_010400_c0845ab1.jpg`;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedMember.id}`;

                  const receiptHtml = `
                    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                    <head>
                      <meta charset="utf-8">
                      <style>
                        .main-table { border-collapse: collapse; width: 500pt; border: 3pt solid #1C3F3A; margin: 20px auto; }
                        .header-banner { background-color: #1C3F3A; text-align: center; color: #ffffff; padding: 15px; font-size: 20pt; font-weight: bold; }
                        .label-cell { background-color: #f1f5f9; font-weight: bold; color: #334155; text-align: right; width: 140pt; padding: 10px; border: 1pt solid #cbd5e1; }
                        .value-cell { color: #0f172a; font-weight: 800; text-align: right; padding: 10px; border: 1pt solid #cbd5e1; font-size: 11pt; }
                        .section-divider { background-color: #f8fafc; font-weight: 900; text-align: center; color: #475569; padding: 8px; border-top: 2pt solid #1C3F3A; }
                        .logo-container { text-align: center; padding: 15px; border-bottom: 1pt solid #1C3F3A; }
                        .id-text { font-family: monospace; color: #B82B2B; font-size: 14pt; font-weight: 900; letter-spacing: 1pt; }
                        .valid-badge { color: #059669; font-size: 14pt; font-weight: 900; }
                      </style>
                    </head>
                    <body dir="rtl">
                      <table class="main-table">
                        <tr>
                          <td colspan="2" class="logo-container" style="width: 50%;">
                            <img src="${clubLogoUrl}" height="65">
                            <div style="font-size: 8pt; font-weight: bold; color: #1C3F3A; margin-top: 5pt;">نادي الثقافة الأمازيغية برشيد</div>
                          </td>
                          <td colspan="2" class="logo-container" style="width: 50%;">
                            <img src="${schoolLogoUrl}" height="55">
                            <div style="font-size: 8pt; font-weight: bold; color: #B82B2B; margin-top: 5pt;">ESEF BERRECHID</div>
                          </td>
                        </tr>
                        <tr><th colspan="4" class="header-banner">بطاقة الانخراط والوصل الرسمي</th></tr>
                        
                        <tr><td colspan="4" class="section-divider">بيانات العضوية</td></tr>
                        <tr>
                          <td rowspan="3" colspan="2" style="text-align: center; vertical-align: middle; border: 1pt solid #cbd5e1;">
                            <img src="${qrUrl}" width="120" height="120">
                            <div style="font-size: 8pt; color: #64748b;">رمز الاستجابة السريعة</div>
                          </td>
                          <td class="label-cell">رقم المنخرط:</td>
                          <td class="value-cell id-text">${selectedMember.id}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">تاريخ التسجيل:</td>
                          <td class="value-cell">${selectedMember.registeredDate}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">حالة الأداء:</td>
                          <td class="value-cell" style="color: ${selectedMember.feePaid ? '#059669' : '#d97706'};">
                            ${selectedMember.feePaid ? 'مؤدى رسميا ✅' : 'قيد الانتظار ⏳'}
                          </td>
                        </tr>

                        <tr><td colspan="4" class="section-divider">المعلومات الشخصية</td></tr>
                        <tr>
                          <td class="label-cell">الاسم الكامل:</td>
                          <td colspan="3" class="value-cell" style="font-size: 14pt; color: #1e293b;">${selectedMember.name}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">رقم البطاقة (CIN):</td>
                          <td colspan="3" class="value-cell">${selectedMember.cin || '---'}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">الشعبة الدراسية:</td>
                          <td colspan="3" class="value-cell">${selectedMember.filiere}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">المستوى الجامعي:</td>
                          <td colspan="3" class="value-cell">${selectedMember.niveau}</td>
                        </tr>
                        <tr>
                          <td class="label-cell">رقم الهاتف:</td>
                          <td colspan="3" class="value-cell" dir="ltr">${selectedMember.phone}</td>
                        </tr>
                        
                        <tr><td colspan="4" class="section-divider">المصادقة الرسمية للنادي</td></tr>
                        <tr>
                          <td colspan="2" style="text-align: center; vertical-align: middle; padding: 20px; border: 1pt solid #cbd5e1;">
                            <div class="valid-badge">✅ عضوية مصادق عليها</div>
                            <div style="font-size: 9pt; color: #64748b; margin-top: 5pt;">إدارة نادي الثقافة الأمازيغية</div>
                          </td>
                          <td colspan="2" style="text-align: center; vertical-align: middle; padding: 15px; border: 1pt solid #cbd5e1;">
                            <img src="${stampUrl}" height="95">
                            <div style="font-size: 8pt; font-weight: bold; color: #1C3F3A; margin-top: 5pt;">ختم الإدارة الرسمي</div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="4" style="background-color: #1C3F3A; color: #ffffff; text-align: center; font-size: 9pt; padding: 10px;">
                            ⵜⴰⵎⴰⵣⵉⵖⵜ · ⵜⵓⵙⵙⵏⴰ · ⵜⴰⵢⵙⵉ | نادي الثقافة الامازيغية برشيد
                          </td>
                        </tr>
                      </table>
                    </body>
                    </html>
                  `;
                  const blob = new Blob([receiptHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `CCAB_Recu_Admin_${selectedMember.name.replace(/\s+/g, '_')}.xls`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>تحميل</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة</span>
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-1.5 rounded-lg bg-[#1C3F3A] text-white text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
