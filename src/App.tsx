import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AmazighHeader, Language } from './components/AmazighHeader';
import { RegistrationView } from './components/RegistrationView';
import { BureauView } from './components/BureauView';
import { Announcement, Member, FinancialTransaction } from './types/bureau';
import { INITIAL_ANNOUNCEMENTS, INITIAL_MEMBERS, MOCK_MEMBER_IDS, MOCK_MEMBER_NAMES } from './data/bureauData';
import { ArchivePhotoReel } from './components/ArchivePhotoReel';
import { PublicAnnouncementsSection } from './components/PublicAnnouncementsSection';
import { VisitorReviewsSection } from './components/VisitorReviewsSection';
import { ToastNotification } from './components/ToastNotification';
import { MembersChatPortal } from './components/MembersChatPortal';
import { DownloadReceiptModal } from './components/DownloadReceiptModal';
import {
  subscribeAnnouncements,
  saveAnnouncementToFirebase,
  deleteAnnouncementFromFirebase,
  subscribeSiteSettings,
  subscribeMembers,
  subscribeTransactions,
  SiteSettings,
  DEFAULT_SITE_SETTINGS
} from './lib/firebase';
import { makeImageTransparent } from './utils/transparentImage';
import {
  UserPlus,
  FileDown,
  MapPin,
  Building2,
  Instagram,
  Facebook,
  ExternalLink,
  Sparkles,
  MessageCircle
} from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [activeNav, setActiveNav] = useState('home');
  const [currentView, setCurrentView] = useState<'home' | 'registration' | 'bureau'>('home');
  
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [transparentSplashLogo, setTransparentSplashLogo] = useState<string>('');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 3000);
    const removeTimer = setTimeout(() => setShowSplash(false), 4000);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  // Shared Announcements state with Firestore real-time sync & localStorage cache for instant loading
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const cached = localStorage.getItem('ccab_announcements');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });
  const [toastAnnouncement, setToastAnnouncement] = useState<Announcement | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Registered members for receipt verification & lookup (cleaned of mock data)
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('ccab_members_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: Member) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name));
        }
      }
    } catch (e) {}
    return [];
  });

  // Real-time Transactions from Treasurer for synchronized accounting members
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ccab_treasurer_transactions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: FinancialTransaction) => !['tr-1', 'tr-2', 'tr-3', 'tr-4', 'tr-5', 'tr-6'].includes(t.id));
        }
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    const unsubMembers = subscribeMembers((data) => {
      if (data) {
        const clean = data.filter((m) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name));
        setMembers(clean);
      }
    });
    const unsubTx = subscribeTransactions((data) => {
      if (data) {
        const clean = data.filter((t) => !['tr-1', 'tr-2', 'tr-3', 'tr-4', 'tr-5', 'tr-6'].includes(t.id));
        setTransactions(clean);
      }
    });
    return () => {
      unsubMembers();
      unsubTx();
    };
  }, []);

  // Merge members from direct registrations and treasurer's accounting records (سجل اللوائح المحاسبية المفصل)
  const allRealMembers = useMemo(() => {
    const list = [...members.filter((m) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name))];

    transactions.forEach((tx) => {
      const isFee = tx.category === 'واجبات الانخراط' || tx.title.includes('انخراط');
      if (isFee) {
        const cleanName = tx.title
          .replace(/^واجب\s*انخراط\s*:\s*/i, '')
          .replace(/^انخراط\s*:\s*/i, '')
          .replace(/^واجب\s*انخراط\s+/i, '')
          .replace(/^انخراط\s+/i, '')
          .trim();

        if (cleanName && !MOCK_MEMBER_NAMES.includes(cleanName)) {
          const exists = list.some((m) => m.name.trim().toLowerCase() === cleanName.toLowerCase());
          if (!exists) {
            const idMatch = tx.notes?.match(/CCAB-\d{4}-\d{3,5}/i);
            const cinMatch = tx.notes?.match(/(?:CIN|بطاقة)\s*:\s*([A-Z0-9]+)/i);
            const phoneMatch = tx.notes?.match(/0[5-7]\d{8}/);
            const filiereMatch = tx.notes?.match(/(?:شعبة|مسلك)\s*:\s*([^\n,/]+)/i);

            list.push({
              id: idMatch ? idMatch[0].toUpperCase() : `CCAB-2026-${tx.id.replace(/\D/g, '').slice(-4) || '1001'}`,
              name: cleanName,
              cin: cinMatch ? cinMatch[1].toUpperCase() : '---',
              filiere: filiereMatch ? filiereMatch[1].trim() : (tx.activity || 'كلية العلوم والتقنيات / ESEF'),
              niveau: 'جامعي - عضوية مسجلة',
              phone: phoneMatch ? phoneMatch[0] : '---',
              feeAmount: tx.amount || 50,
              feePaid: tx.type === 'income',
              paidDate: tx.date,
              registeredDate: tx.date,
              notes: tx.notes || `مسجل عبر سجل العمليات المحاسبية لأمين المال (${tx.title})`,
              registrationSource: 'treasurer',
              approvalStatus: 'approved'
            });
          }
        }
      }
    });

    return list;
  }, [members, transactions]);

  // Persist announcements to localStorage whenever they update
  useEffect(() => {
    if (announcements.length > 0) {
      try {
        localStorage.setItem('ccab_announcements', JSON.stringify(announcements));
      } catch (e) {
        console.warn('LocalStorage quota exceeded, skipping cache update.');
      }
    }
  }, [announcements]);

  // Dynamic Site Settings (Social Links & WhatsApp)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const prevAnnouncementIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Real-time Firestore subscription for site settings
  useEffect(() => {
    const unsubSettings = subscribeSiteSettings((data) => {
      if (data) setSiteSettings(data);
    });
    return () => unsubSettings();
  }, []);

  // Process transparent logo without white background
  useEffect(() => {
    const rawLogo = siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
    makeImageTransparent(rawLogo).then((cleanUrl) => {
      setTransparentSplashLogo(cleanUrl);
    });
  }, [siteSettings.clubLogoUrl]);

  // Real-time Firestore subscription for announcements & Toast trigger
  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((data) => {
      if (data && data.length > 0) {
        setAnnouncements(data);

        // Check for new announcement items to trigger Toast Notification
        const currentIds = new Set(data.map((a) => a.id));
        
        if (isInitialLoadRef.current) {
          // On first page load, record existing IDs without popping up toast
          prevAnnouncementIdsRef.current = currentIds;
          isInitialLoadRef.current = false;
        } else {
          // Find newly added announcement
          const newlyAdded = data.find((a) => !prevAnnouncementIdsRef.current.has(a.id));
          if (newlyAdded) {
            setToastAnnouncement(newlyAdded);
          }
          prevAnnouncementIdsRef.current = currentIds;
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync document direction and language
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Sync announcements changes to Firebase
  const handleAddAnnouncement = (ann: Announcement) => {
    saveAnnouncementToFirebase(ann);
    setToastAnnouncement(ann);
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncementFromFirebase(id);
  };

  const handleSelectNav = (id: string) => {
    setActiveNav(id);
    if (id === 'bureau') {
      setCurrentView('bureau');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'registration' || id === 'join') {
      setCurrentView('registration');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentView !== 'home') {
      setCurrentView('home');
    }

    if (id === 'chat-portal' || id === 'reviews' || id === 'contact') {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRtl = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const getWhatsappLink = (num: string) => {
    if (!num) return '#';
    if (num.startsWith('http')) return num;
    return `https://wa.me/${num.replace(/\D/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-[#faf7ee]/30 flex flex-col font-sans text-slate-800 w-full overflow-x-hidden">
      
      {/* Splash Screen Animation */}
      {showSplash && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <img 
              src={transparentSplashLogo || siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png'} 
              className="w-56 sm:w-72 h-auto max-h-36 object-contain mb-3 drop-shadow-sm" 
              alt={siteSettings.clubNameAr || "شعار النادي"} 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
              }}
              style={{ mixBlendMode: 'multiply' }}
            />
            <div className="text-xl sm:text-2xl font-black text-[#1C3F3A]">
              {siteSettings.clubNameAr || "نادي الثقافة الأمازيغية ببرشيد"}
            </div>
          </div>
        </div>
      )}

      {/* 1. FIXED TOP BAR (الشريط العلوي الثابت) */}
      <AmazighHeader
        currentLang={currentLang}
        onSelectLang={(lang) => setCurrentLang(lang)}
        activeNav={activeNav}
        onSelectNav={handleSelectNav}
        onOpenJoinModal={() => setCurrentView('registration')}
        siteSettings={siteSettings}
      />

      {/* Main Container starts right below the fixed header */}
      <main className="flex-1 pt-14 sm:pt-16 w-full flex flex-col justify-between">
        
        {/* 2. REGISTRATION VIEW */}
        {currentView === 'registration' ? (
          <RegistrationView
            currentLang={currentLang}
            onClose={() => setCurrentView('home')}
            siteSettings={siteSettings}
          />
        ) : currentView === 'bureau' ? (
          /* 3. BUREAU VIEW */
          <BureauView
            currentLang={currentLang}
            onClose={() => setCurrentView('home')}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        ) : (
          /* 4. HOME VIEW: Only Archive Reel + Join Button + Bottom Club Info Footer with Logos & Social */
          <div className="w-full flex-1 flex flex-col">
            
            {/* Archive Photos Ribbon: Dynamic photos from publisher posts, warm background, slogan title, no pause button */}
            <ArchivePhotoReel
              currentLang={currentLang}
              announcements={announcements}
            />

            {/* JOIN CLUB & DOWNLOAD RECEIPT BUTTONS (أيقونة الانخراط وبجانبها أيقونة تحميل الوصل) */}
            <section className="py-10 sm:py-14 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#f8f5ee] via-white to-white border-b border-[#e5dec9]">
              <div className="max-w-xl mx-auto text-center flex flex-col items-center w-full">
                
                {/* Cultural Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#1C3F3A] text-xs font-bold mb-4 shadow-sm"
                  style={{ borderStyle: 'none', backgroundColor: '#ffffff', borderColor: '#ffffff' }}
                >
                  <span>
                    {isFr 
                      ? 'Campagne d\'Adhésion Ouverte' 
                      : (isTm ? 'ⴰⵙⴽⵛⵎ ⵏ ⵓⵙⵉⵔⴰⵎ ⵉⵕⵥⵎ' : 'حملة الانخراط السنوي مفتوحة')}
                  </span>
                </div>

                {/* Primary Actions: Join + Download Receipt */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full">
                  {/* Button 1: طلب الانخراط */}
                  <button
                    onClick={() => {
                      setCurrentView('registration');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ backgroundColor: '#ffe132', color: '#000000' }}
                    className="group relative inline-flex items-center justify-center gap-3 text-base sm:text-lg font-black px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-300/40 w-full sm:w-auto"
                    title="الانخراط في نادي الثقافة الأمازيغية ببرشيد"
                  >
                    <span className="w-9 h-9 rounded-xl bg-black/10 backdrop-blur-sm flex items-center justify-center font-black text-xl group-hover:rotate-12 transition-transform shadow-inner" style={{ color: '#000000' }}>
                      <UserPlus className="w-5 h-5" />
                    </span>
                    
                    <span className="tracking-wide">
                      {isFr
                        ? 'Demande d\'Adhésion (الانخراط)'
                        : (isTm ? 'ⴰⵙⴽⵛⵎ ⵖⵔ ⵓⵙⵉⵔⴰⵎ' : 'طلب الانخراط في النادي')}
                    </span>
                  </button>

                  {/* Button 2: تحميل وصل التسجيل */}
                  <button
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="group relative inline-flex items-center justify-center gap-3 text-base sm:text-lg font-black px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 bg-[#1C3F3A] hover:bg-[#142e2a] text-white border border-[#142e2a]/50 w-full sm:w-auto"
                    title="تحميل وصل التسجيل بواسطة رقم العضوية"
                  >
                    <span className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-amber-300 group-hover:-translate-y-0.5 transition-transform shadow-inner">
                      <FileDown className="w-5 h-5" />
                    </span>
                    
                    <span className="tracking-wide">
                      {isFr
                        ? 'Télécharger le Reçu'
                        : (isTm ? 'ⴰⴳⵎ ⵏ ⵜⴼⵔⵜ' : 'تحميل وصل التسجيل')}
                    </span>
                  </button>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md">
                  {isFr
                    ? 'Remplissez le formulaire d\'adhésion en quelques clics ou téléchargez directement votre reçu officiel à l\'aide de votre numéro d\'adhérent.'
                    : 'سجل معلوماتك للانخراط السنوي أو حمّل وصل تسجيلك مباشرة بإدخال رقم العضوية الخاص بك بصيغة Excel ملونة وبطاقة رسمية.'}
                </p>

              </div>
            </section>

            {/* PUBLIC ANNOUNCEMENTS & POSTS SECTION (قسم الإعلانات والمنشورات الرسمية أسفل الموقع) */}
            <PublicAnnouncementsSection
              announcements={announcements}
              currentLang={currentLang}
            />

            {/* VISITOR REVIEWS & OPINIONS SECTION (قسم التقييمات وإضافة الآراء وحفظها أسفل الموقع) */}
            <VisitorReviewsSection currentLang={currentLang} />



          </div>
        )}

      </main>

      {/* 5. BOTTOM BAR: Club Name, Location, Social Icons (Facebook, Instagram & WhatsApp), and Sized Transparent Logos */}
      <footer id="contact" className="w-full bg-[#fcfbf9] border-t border-[#e2dcc5] py-6 sm:py-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LOGOS (الشعارات المصغرة مع إزالة الخلفية البيضاء بواسطة mix-blend-multiply والإظهار الفوري) */}
          <div className="flex items-center gap-5 sm:gap-6 order-2 md:order-1">
            
            {/* 1. Official Club Logo */}
            <div className="flex items-center gap-2 group" title={siteSettings.clubNameAr || "شعار النادي"}>
              <img
                src={siteSettings.clubLogoUrl || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png'}
                alt={siteSettings.clubNameAr || "شعار النادي"}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
                  }
                }}
                className="h-12 sm:h-16 w-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200"
                loading="eager"
              />
            </div>

            <div className="h-10 w-px bg-amber-900/15 hidden sm:block"></div>

            {/* 2. Official Institution Logo */}
            <div className="flex items-center gap-2 group" title="شعار المؤسسة ESEFB">
              <img
                src={siteSettings.schoolLogoUrl || '/assets/aistudio/image_e594bc88.png'}
                alt="Institution Logo"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/assets/aistudio/image_e594bc88.png';
                  }
                }}
                className="h-10 sm:h-14 w-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-200"
                loading="eager"
              />
            </div>

          </div>

          {/* CLUB NAME & LOCATION (الشريط الذي فيه اسم النادي والموقع) */}
          <div className="text-center md:text-start order-1 md:order-2 flex-1 md:px-6">
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-black text-sm sm:text-base">
              <span className="text-[#B82B2B] text-base">ⵣ</span>
              <span>
                {isFr ? (siteSettings.clubNameFr || 'Nom du Club') : (siteSettings.clubNameAr || 'اسم النادي')}
              </span>
              <span className="text-slate-400 font-normal hidden sm:inline">·</span>
              <span className="text-[11px] font-bold text-[#1C3F3A] hidden sm:inline font-mono">
                {isFr ? 'ADHERENTS' : 'المنخرطين'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#1C3F3A]" />
                <span>
                  {isFr
                    ? 'École Supérieure de l\'Éducation et de la Formation (ESEFB)'
                    : 'المدرسة العليا للتربية والتكوين ببرشيد - جامعة الحسن الأول'}
                </span>
              </span>

              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#B82B2B]" />
                <span>{isFr ? 'Berrechid, Maroc' : 'برشيد، المملكة المغربية'}</span>
              </span>
            </div>
          </div>

          {/* SOCIAL MEDIA ICONS (أيقونات الفيسبوك، الإنستغرام والواتساب) */}
          <div className="flex items-center gap-3 order-3">
            
            {/* WhatsApp Link & Icon */}
            <a
              href={getWhatsappLink(siteSettings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center shadow-sm hover:shadow-md border border-emerald-200/80 hover:border-[#25D366] transition-all duration-200 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

            {/* Facebook Link & Icon */}
            <a
              href={siteSettings.facebookUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center shadow-sm hover:shadow-md border border-blue-200/80 hover:border-[#1877F2] transition-all duration-200 hover:-translate-y-0.5"
            >
              <Facebook className="w-4 h-4 fill-current" />
            </a>

            {/* Instagram Link & Icon */}
            <a
              href={siteSettings.instagramUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-xl bg-pink-50 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-[#E1306C] hover:text-white flex items-center justify-center shadow-sm hover:shadow-md border border-pink-200/80 hover:border-transparent transition-all duration-200 hover:-translate-y-0.5"
            >
              <Instagram className="w-4 h-4" />
            </a>

          </div>

        </div>
      </footer>

      {/* FLOATING QUICK WHATSAPP BUTTON (زر الواتساب العائم للتواصل المباشر) */}
      <a
        href={getWhatsappLink(siteSettings.whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Quick Contact"
        title="تواصل مباشر عبر الواتساب"
        className="fixed bottom-5 left-5 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-white/30 group"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
        <span className="text-xs font-black hidden sm:inline max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          {isFr ? 'WhatsApp Direct' : 'تواصل عبر الواتساب'}
        </span>
      </a>


      {/* Real-Time Toast Notification for New Announcements / Posts */}
      <ToastNotification
        announcement={toastAnnouncement}
        onClose={() => setToastAnnouncement(null)}
        onViewAnnouncement={(ann) => {
          if (currentView !== 'home') {
            setCurrentView('home');
          }
          setTimeout(() => {
            const el = document.getElementById(`announcement-${ann.id}`) || document.getElementById('public-announcements');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 150);
        }}
        currentLang={currentLang}
      />

      {/* Direct Receipt Download Modal by Membership ID */}
      <DownloadReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        currentLang={currentLang}
        siteSettings={siteSettings}
        members={allRealMembers}
        onOpenRegister={() => {
          setCurrentView('registration');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
