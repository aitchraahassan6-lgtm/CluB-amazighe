import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FolderLock,
  Sparkles,
  Key,
  Settings,
  Shield,
  ArrowRight,
  ArrowLeft,
  Megaphone,
  Wallet,
  Building2,
  Calendar,
  BadgeCheck,
  UserCheck,
  MessageSquare,
  Share2,
  MessageCircle,
  Instagram,
  Facebook,
  Trash2,
  X
} from 'lucide-react';
import { Language } from './AmazighHeader';
import { Announcement, FinancialTransaction, ActivityBudget, Member, VisitorReview } from '../types/bureau';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ACTIVITY_BUDGETS,
  INITIAL_MEMBERS,
  MOCK_MEMBER_IDS,
  MOCK_MEMBER_NAMES
} from '../data/bureauData';
import { MediaPublishingSection } from './MediaPublishingSection';
import { TreasurerSection } from './TreasurerSection';
import { MembersRegistrySection } from './MembersRegistrySection';
import { MembersChatPortal } from './MembersChatPortal';
import {
  subscribeAnnouncements,
  saveAnnouncementToFirebase,
  deleteAnnouncementFromFirebase,
  subscribeTransactions,
  saveTransactionToFirebase,
  deleteTransactionFromFirebase,
  subscribeActivityBudgets,
  saveActivityBudgetToFirebase,
  deleteActivityBudgetFromFirebase,
  subscribeMembers,
  saveMemberToFirebase,
  deleteMemberFromFirebase,
  subscribeSiteSettings,
  saveSiteSettingsToFirebase,
  subscribeVisitorReviews,
  deleteVisitorReviewFromFirebase,
  clearAllVisitorReviewsFromFirebase,
  SiteSettings,
  DEFAULT_SITE_SETTINGS
} from '../lib/firebase';

export interface BureauRoleItem {
  id: string;
  roleAr: string;
  roleFr: string;
  nameAr: string;
  nameFr: string;
  gateAr: string;
  gateFr: string;
  defaultTab: 'media' | 'treasurer' | 'adherents' | 'chat' | 'members';
  badgeColor: string;
  descriptionAr: string;
  descriptionFr: string;
}

export const BUREAU_ROLES: BureauRoleItem[] = [
  {
    id: 'role-president',
    roleAr: 'الرئيس',
    roleFr: 'Président du Club',
    nameAr: 'عبد السلام اردوز',
    nameFr: 'Abdessalam Ardouz',
    gateAr: 'البوابة الشاملة والإشراف العام',
    gateFr: 'Direction & Coordination Générale',
    defaultTab: 'adherents',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    descriptionAr: 'التمثيل القانوني والإشراف الإداري العام والتنسيق',
    descriptionFr: 'Représentation légale et coordination générale du bureau'
  },
  {
    id: 'role-vice-president',
    roleAr: 'نائبة الرئيس',
    roleFr: 'Vice-Présidente',
    nameAr: 'فاطمة الزهراء أوبكى',
    nameFr: 'Fatima-Zahra Oubaki',
    gateAr: 'تنسيق اللجان والأنشطة العامة',
    gateFr: 'Coordination des commissions',
    defaultTab: 'adherents',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    descriptionAr: 'نائبة الرئيس وتنسيق اللجان الوظيفية والأنشطة',
    descriptionFr: 'Coordination des commissions fonctionnelles du club'
  },
  {
    id: 'role-secretary',
    roleAr: 'الكاتبة العامة',
    roleFr: 'Secrétaire Générale',
    nameAr: 'خديجة أباغوغ',
    nameFr: 'Khadija Abaghoug',
    gateAr: 'سجل الأعضاء والمنخرطين والوثائق',
    gateFr: 'Registre des Adhérents & PV',
    defaultTab: 'adherents',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    descriptionAr: 'المسؤولة عن سجل المنخرطين والأعضاء ومحاضر الاجتماعات',
    descriptionFr: 'Responsable du registre des membres et des procès-verbaux'
  },
  {
    id: 'role-vice-secretary',
    roleAr: 'نائبة الكاتبة العامة',
    roleFr: 'Vice-Secrétaire Générale',
    nameAr: 'فاطمة مساوي',
    nameFr: 'Fatima Messaoudi',
    gateAr: 'المراسلات وتوثيق الاجتماعات',
    gateFr: 'Correspondances & Procès-verbaux',
    defaultTab: 'adherents',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
    descriptionAr: 'نائبة الكاتبة العامة والمكلفة بتوثيق المراسلات واللقاءات',
    descriptionFr: 'Suivi des procès-verbaux et correspondances'
  },
  {
    id: 'role-treasurer',
    roleAr: 'أمين المال',
    roleFr: 'Trésorier Général',
    nameAr: 'عبد الواحد أيت سعيد',
    nameFr: 'Abdelwahed Ait Said',
    gateAr: 'قسم المالية والمشتريات والميزانية',
    gateFr: 'Trésorerie & Comptabilité',
    defaultTab: 'treasurer',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    descriptionAr: 'المسؤول عن المالية والحسابات والمشتريات وميزانيات الأنشطة',
    descriptionFr: 'Gestion de la comptabilité, achats et budgets des activités'
  },
  {
    id: 'role-vice-treasurer',
    roleAr: 'نائبة أمين المال',
    roleFr: 'Vice-Trésorière',
    nameAr: 'نادية بعني',
    nameFr: 'Nadia Baani',
    gateAr: 'متابعة المشتريات واستخلاص الانخراطات',
    gateFr: 'Cotisations & Comptabilité',
    defaultTab: 'treasurer',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    descriptionAr: 'نائبة أمين المال ومتابعة تحصيل الواجبات والمشتريات',
    descriptionFr: 'Suivi de la facturation et aide à la trésorerie'
  },
  {
    id: 'role-documentation',
    roleAr: 'مسؤول التوثيق والإعلام',
    roleFr: 'Responsable Documentation & Médias',
    nameAr: 'حسن ايت شراع',
    nameFr: 'Hassan Ait Chraa',
    gateAr: 'إعدادات النشر والإعلانات والمستجدات',
    gateFr: 'Publications & Médias Officiels',
    defaultTab: 'media',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    descriptionAr: 'المسؤول عن التوثيق والنشر والإعلام الرسمي للنادي',
    descriptionFr: 'Publication des annonces, actualités et médias du club'
  },
  {
    id: 'role-vice-doc-1',
    roleAr: 'النائب الأول لمسؤول التوثيق والإعلام',
    roleFr: '1er Vice-Responsable Doc & Médias',
    nameAr: 'عبد الله ندبعلي',
    nameFr: 'Abdellah Nedbaali',
    gateAr: 'الأرشيف الرقمي وتوثيق الصور',
    gateFr: 'Archives numériques & Documentation',
    defaultTab: 'media',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    descriptionAr: 'مكلف بالأرشيف الرقمي وتوثيق الأنشطة بالصور والفيديو',
    descriptionFr: 'Gestion des archives et documentation des événements'
  },
  {
    id: 'role-vice-doc-2',
    roleAr: 'النائب الثاني لمسؤول التوثيق والإعلام',
    roleFr: '2ème Vice-Responsable Doc & Médias',
    nameAr: 'محمد صديقي',
    nameFr: 'Mohamed Seddiki',
    gateAr: 'التوثيق الميداني والسمعي البصري',
    gateFr: 'Documentation Audiovisuelle',
    defaultTab: 'media',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
    descriptionAr: 'مكلف بالتوثيق الميداني والتغطيات الإعلامية',
    descriptionFr: 'Documentation sur le terrain et couverture médiatique'
  },
  {
    id: 'role-communication',
    roleAr: 'مسؤولة التواصل',
    roleFr: 'Responsable Communication',
    nameAr: 'بشرى المرابط',
    nameFr: 'Bouchra El Mourabit',
    gateAr: 'العلاقات العامة والتواصل الخارجي',
    gateFr: 'Relations Publiques & Communication',
    defaultTab: 'media',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    descriptionAr: 'المسؤولة عن التواصل الخارجي والعلاقات العامة مع المؤسسات',
    descriptionFr: 'Relations publiques et communication externe du club'
  },
  {
    id: 'role-vice-comm',
    roleAr: 'نائب مسؤولة التواصل',
    roleFr: 'Vice-Responsable Communication',
    nameAr: 'معاد أيت واحمان',
    nameFr: 'Mouad Ait Ouahmane',
    gateAr: 'التواصل الرقمي وصناعة المحتوى',
    gateFr: 'Communication Numérique',
    defaultTab: 'chat',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300',
    descriptionAr: 'نائب مسؤولة التواصل وصناعة المحتوى الرقمي',
    descriptionFr: 'Création de contenu et soutien communication'
  },
  {
    id: 'role-advisor',
    roleAr: 'مستشارة',
    roleFr: 'Conseillère',
    nameAr: 'مليكة اهبور',
    nameFr: 'Malika Ahbour',
    gateAr: 'التنسيق الاستشاري الداخلي',
    gateFr: 'Conseil & Coordination Interne',
    defaultTab: 'chat',
    badgeColor: 'bg-slate-100 text-slate-900 border-slate-300',
    descriptionAr: 'مستشارة المكتب للتنسيق والتوجيه الداخلي للأنشطة',
    descriptionFr: 'Conseil stratégique et soutien aux activités'
  }
];

interface BureauViewProps {
  currentLang: Language;
  onClose: () => void;
  announcements?: Announcement[];
  onAddAnnouncement?: (ann: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export const BureauView: React.FC<BureauViewProps> = ({
  currentLang,
  onClose,
  announcements: propAnnouncements,
  onAddAnnouncement: propOnAddAnnouncement,
  onDeleteAnnouncement: propOnDeleteAnnouncement
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  // Selected Role for Bureau Login Gate (null until selected after password)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  // Active bureau tab: 'media', 'treasurer', 'adherents', 'chat', 'members', 'settings', 'reviews'
  const [activeBureauTab, setActiveBureauTab] = useState<'media' | 'treasurer' | 'adherents' | 'chat' | 'members' | 'settings' | 'reviews'>('adherents');

  // Individual Portal Password Authentication state
  const [rolePasswordModalOpen, setRolePasswordModalOpen] = useState(false);
  const [targetRoleForAuth, setTargetRoleForAuth] = useState<BureauRoleItem | null>(null);
  const [rolePasswordInput, setRolePasswordInput] = useState('');
  const [rolePasswordError, setRolePasswordError] = useState(false);
  const [showRolePassword, setShowRolePassword] = useState(false);

  const getRolePassword = (roleId: string) => {
    return localStorage.getItem(`ccab_role_pwd_${roleId}`) || 'CLUBAMAZIGHE@2026CLUBAMAZIGHE@2026';
  };
  const setRolePassword = (roleId: string, pwd: string) => {
    localStorage.setItem(`ccab_role_pwd_${roleId}`, pwd);
  };

  // Review handler
  const handleDeleteReview = async (id: string) => {
    console.log('Attempting to delete review with ID:', id);
    if (window.confirm(isFr ? 'Voulez-vous vraiment supprimer cet avis ?' : 'هل أنت متأكد من حذف هذا الرأي؟')) {
      try {
        await deleteVisitorReviewFromFirebase(id);
        showNotification(isFr ? 'Avis supprimé avec succès' : 'تم حذف الرأي بنجاح');
      } catch (err) {
        console.error('Delete failed:', err);
        showNotification(isFr ? 'Erreur lors de la suppression' : 'حدث خطأ أثناء الحذف');
      }
    }
  };
  const [notification, setNotification] = useState<string | null>(null);
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Password Management state (allows admin to change password)
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    return localStorage.getItem('ccab_bureau_password') || 'CLUBAMAZIGHE@2026CLUBAMAZIGHE@2026';
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // Real-time Announcements State from Firestore
  const [localAnnouncements, setLocalAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Real-time Transactions State with Dual Persistence (Firestore + LocalStorage)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ccab_treasurer_transactions_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t: FinancialTransaction) => !['tr-1', 'tr-2', 'tr-3', 'tr-4', 'tr-5', 'tr-6'].includes(t.id));
        }
      }
    } catch (e) {
      console.warn('Failed reading transactions from localStorage', e);
    }
    return [];
  });

  // Real-time Activity Budgets State with Dual Persistence (Firestore + LocalStorage)
  const [activityBudgets, setActivityBudgets] = useState<ActivityBudget[]>(() => {
    try {
      const saved = localStorage.getItem('ccab_treasurer_budgets_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((b: ActivityBudget) => !['act-1', 'act-2', 'act-3'].includes(b.id));
        }
      }
    } catch (e) {
      console.warn('Failed reading budgets from localStorage', e);
    }
    return [];
  });

  // Always keep localStorage synchronized immediately whenever transactions change
  useEffect(() => {
    try {
      localStorage.setItem('ccab_treasurer_transactions_v2', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed saving transactions to localStorage', e);
    }
  }, [transactions]);

  // Always keep localStorage synchronized immediately whenever activity budgets change
  useEffect(() => {
    try {
      localStorage.setItem('ccab_treasurer_budgets_v2', JSON.stringify(activityBudgets));
    } catch (e) {
      console.warn('Failed saving activity budgets to localStorage', e);
    }
  }, [activityBudgets]);

  // Real-time Registered Members State with Dual Persistence (Firestore + LocalStorage)
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem('ccab_members_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: Member) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name));
        }
      }
    } catch (e) {
      console.warn('Failed reading members from localStorage', e);
    }
    return [];
  });

  // Always keep localStorage synchronized immediately whenever members change
  useEffect(() => {
    try {
      localStorage.setItem('ccab_members_v2', JSON.stringify(members));
    } catch (e) {
      console.warn('Failed saving members to localStorage', e);
    }
  }, [members]);

  // Real-time Site Settings & Social Media Links State from Firestore
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);
  const [clearReviewsSuccess, setClearReviewsSuccess] = useState(false);

  // Real-time Visitor Reviews State from Firestore
  const [reviews, setReviews] = useState<VisitorReview[]>([]);

  // Real-time Firestore subscriptions for all Bureau entities
  useEffect(() => {
    const unsubMembers = subscribeMembers((data) => {
      if (data) {
        const clean = data.filter((m) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name));
        setMembers(clean);
      }
    });
    const unsubTransactions = subscribeTransactions((data) => {
      if (data) {
        const clean = data.filter((t) => !['tr-1', 'tr-2', 'tr-3', 'tr-4', 'tr-5', 'tr-6'].includes(t.id));
        if (clean.length > 0) {
          setTransactions(clean);
        }
      }
    });
    const unsubBudgets = subscribeActivityBudgets((data) => {
      if (data) {
        const clean = data.filter((b) => !['act-1', 'act-2', 'act-3'].includes(b.id));
        if (clean.length > 0) {
          setActivityBudgets(clean);
        }
      }
    });
    const unsubAnnouncements = subscribeAnnouncements((data) => {
      if (data && data.length > 0) setLocalAnnouncements(data);
    });
    const unsubSettings = subscribeSiteSettings((data) => {
      if (data) setSiteSettings(data);
    });
    const unsubReviews = subscribeVisitorReviews((data) => {
      if (data) setReviews(data);
    });

    return () => {
      unsubMembers();
      unsubTransactions();
      unsubBudgets();
      unsubAnnouncements();
      unsubSettings();
      unsubReviews();
    };
  }, []);

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettingsToFirebase(siteSettings);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleClearAllReviews = async () => {
    if (window.confirm(isFr ? 'Voulez-vous vraiment supprimer tous les avis enregistrés ?' : 'هل أنت متأكد من مسح جميع الآراء والتقييمات المحفوظة من الموقع وقاعدة البيانات؟')) {
      await clearAllVisitorReviewsFromFirebase();
      setClearReviewsSuccess(true);
      setTimeout(() => setClearReviewsSuccess(false), 3000);
    }
  };

  const effectiveAnnouncements = propAnnouncements || localAnnouncements;

  const handleAddAnnouncement = (ann: Announcement) => {
    saveAnnouncementToFirebase(ann);
    if (propOnAddAnnouncement) propOnAddAnnouncement(ann);
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncementFromFirebase(id);
    if (propOnDeleteAnnouncement) propOnDeleteAnnouncement(id);
  };

  // Immediate state update + LocalStorage backup + Firestore real-time sync
  const handleAddTransaction = (tr: FinancialTransaction) => {
    setTransactions((prev) => {
      const exists = prev.some((t) => t.id === tr.id);
      const updated = exists ? prev.map((t) => (t.id === tr.id ? tr : t)) : [tr, ...prev];
      try {
        localStorage.setItem('ccab_treasurer_transactions_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    saveTransactionToFirebase(tr).catch((err) => {
      console.warn('Firebase transaction save note:', err);
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('ccab_treasurer_transactions_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    deleteTransactionFromFirebase(id).catch((err) => {
      console.warn('Firebase transaction delete note:', err);
    });
  };

  const handleAddActivityBudget = (act: ActivityBudget) => {
    setActivityBudgets((prev) => {
      const exists = prev.some((a) => a.id === act.id);
      const updated = exists ? prev.map((a) => (a.id === act.id ? act : a)) : [...prev, act];
      try {
        localStorage.setItem('ccab_treasurer_budgets_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    saveActivityBudgetToFirebase(act).catch((err) => {
      console.warn('Firebase budget save note:', err);
    });
  };

  const handleDeleteActivityBudget = (id: string) => {
    setActivityBudgets((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem('ccab_treasurer_budgets_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    deleteActivityBudgetFromFirebase(id).catch((err) => {
      console.warn('Firebase budget delete note:', err);
    });
  };

  const handleClearAllTreasurerData = () => {
    if (window.confirm(isFr ? 'Voulez-vous vraiment réinitialiser toutes les données de trésorerie à zéro (0 MAD) ?' : 'هل أنت متأكد من مسح جميع المعاملات والميزانيات والبدء من الصفر (0 درهم)؟')) {
      transactions.forEach((t) => deleteTransactionFromFirebase(t.id).catch(() => {}));
      activityBudgets.forEach((b) => deleteActivityBudgetFromFirebase(b.id).catch(() => {}));
      setTransactions([]);
      setActivityBudgets([]);
      try {
        localStorage.setItem('ccab_treasurer_transactions_v2', JSON.stringify([]));
        localStorage.setItem('ccab_treasurer_budgets_v2', JSON.stringify([]));
      } catch (e) {}
      showNotification(isFr ? 'Données du trésorier réinitialisées à zéro' : 'تم تصفير جميع حسابات وميزانيات أمين المال والبدء من الصفر بنجاح');
    }
  };

  // Member Management Handlers with real-time persistence in Firestore
  const handleAddMember = (newMember: Member) => {
    saveMemberToFirebase(newMember);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    saveMemberToFirebase(updatedMember);
  };

  const handleDeleteMember = (id: string) => {
    deleteMemberFromFirebase(id);
  };

  // When fee is marked paid, automatically factor into club accounts
  const handleRecordFeeToTreasury = (memberName: string, amount: number) => {
    const newTr: FinancialTransaction = {
      id: `tr-fee-${Date.now()}`,
      type: 'income',
      title: `واجب انخراط: ${memberName}`,
      amount,
      category: 'واجبات الانخراط',
      date: new Date().toISOString().split('T')[0],
      activity: 'حملة الانخراط السنوية',
      notes: 'استخلاص واجب بطاقة العضوية والانخراط'
    };
    handleAddTransaction(newTr);
  };

  // Automatically sync and retain members from detailed accounting records (سجل اللوائح المحاسبية المفصل)
  const mergedMembers = React.useMemo(() => {
    const list = [...members.filter((m) => !MOCK_MEMBER_IDS.includes(m.id) && !MOCK_MEMBER_NAMES.includes(m.name))];
    
    // Check transactions for membership fees or members entered by the Treasurer
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

  const isRtl = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const selectedRoleObj = BUREAU_ROLES.find(r => r.id === selectedRoleId) || BUREAU_ROLES[0];

  // Step 1 Login handler: Password checks first
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length > 0) {
      if (savedPassword && password.trim() !== savedPassword) {
        setError(true);
      } else {
        setIsAuthenticated(true);
        setError(false);
        setSelectedRoleId(null); // Proceed to Step 2: Role Selection
      }
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError(false);
    setSelectedRoleId(null);
  };

  const handleGoBack = () => {
    if (selectedRoleId) {
      setSelectedRoleId(null);
    } else if (isAuthenticated) {
      setIsAuthenticated(false);
    } else {
      onClose();
    }
  };

  const handleSelectRole = (role: BureauRoleItem) => {
    setTargetRoleForAuth(role);
    setRolePasswordInput('');
    setRolePasswordError(false);
    setRolePasswordModalOpen(true);
  };

  const handleVerifyRolePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoleForAuth) return;
    const correctPwd = getRolePassword(targetRoleForAuth.id);
    if (rolePasswordInput.trim() === correctPwd) {
      setSelectedRoleId(targetRoleForAuth.id);
      setActiveBureauTab(targetRoleForAuth.defaultTab);
      setRolePasswordModalOpen(false);
      setTargetRoleForAuth(null);
    } else {
      setRolePasswordError(true);
    }
  };

  // Admin changing password handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 3) {
      setPasswordChangeError(isFr ? 'Le mot de passe doit contenir au moins 3 caractères' : 'يجب أن تحتوي كلمة السر على 3 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError(isFr ? 'Les mots de passe ne correspondent pas' : 'كلمتا المرور غير متطابقتين');
      return;
    }
    localStorage.setItem('ccab_bureau_password', newPassword.trim());
    setSavedPassword(newPassword.trim());
    setPasswordChangeSuccess(true);
    setPasswordChangeError('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setPasswordChangeSuccess(false);
    }, 2500);
  };

  const handleResetPasswordToAny = () => {
    localStorage.removeItem('ccab_bureau_password');
    setSavedPassword('');
    setPasswordChangeSuccess(true);
    setTimeout(() => {
      setPasswordChangeSuccess(false);
    }, 2500);
  };

  // Board members list
  const bureauMembers = [
    {
      roleAr: 'الرئيس',
      roleFr: 'Président',
      nameAr: 'عبد السلام اردوز',
      nameFr: 'Abdessalam Ardouz',
      tagAr: 'التمثيل القانوني والإشراف الإداري العام والتنسيق',
      tagFr: 'Représentation légale & Coordination générale',
      phone: '06 61 XX XX XX',
      highlight: true
    },
    {
      roleAr: 'نائبة الرئيس',
      roleFr: 'Vice-Présidente',
      nameAr: 'فاطمة الزهراء أوبكى',
      nameFr: 'Fatima-Zahra Oubaki',
      tagAr: 'نائبة الرئيس وتنسيق اللجان الوظيفية والأنشطة',
      tagFr: 'Coordination des commissions fonctionnelles',
      phone: '06 62 XX XX XX',
    },
    {
      roleAr: 'الكاتبة العامة',
      roleFr: 'Secrétaire Générale',
      nameAr: 'خديجة أباغوغ',
      nameFr: 'Khadija Abaghoug',
      tagAr: 'سجل المنخرطين والأعضاء ومحاضر الاجتماعات',
      tagFr: 'Registre des membres & Procès-verbaux',
      phone: '06 63 XX XX XX',
      highlight: true
    },
    {
      roleAr: 'نائبة الكاتبة العامة',
      roleFr: 'Vice-Secrétaire Générale',
      nameAr: 'فاطمة مساوي',
      nameFr: 'Fatima Messaoudi',
      tagAr: 'نائبة الكاتبة العامة وتوثيق المراسلات واللقاءات',
      tagFr: 'Suivi des procès-verbaux et correspondances',
      phone: '06 64 XX XX XX',
    },
    {
      roleAr: 'أمين المال',
      roleFr: 'Trésorier Général',
      nameAr: 'عبد الواحد أيت سعيد',
      nameFr: 'Abdelwahed Ait Said',
      tagAr: 'إدارة المالية والحسابات والمشتريات والميزانيات',
      tagFr: 'Comptabilité, Achats & Budgets',
      phone: '06 65 XX XX XX',
      highlight: true
    },
    {
      roleAr: 'نائبة أمين المال',
      roleFr: 'Vice-Trésorière',
      nameAr: 'نادية بعني',
      nameFr: 'Nadia Baani',
      tagAr: 'نائبة أمين المال ومتابعة تحصيل الواجبات والمشتريات',
      tagFr: 'Suivi de la facturation et cotisations',
      phone: '06 66 XX XX XX',
    },
    {
      roleAr: 'مسؤول التوثيق والإعلام',
      roleFr: 'Responsable Doc & Médias',
      nameAr: 'حسن ايت شراع',
      nameFr: 'Hassan Ait Chraa',
      tagAr: 'الإشراف على التوثيق والنشر والإعلام الرسمي للنادي',
      tagFr: 'Publications officielles & Médias',
      phone: '06 67 XX XX XX',
      highlight: true
    },
    {
      roleAr: 'النائب الأول لمسؤول التوثيق والإعلام',
      roleFr: '1er Vice-Responsable Doc & Médias',
      nameAr: 'عبد الله ندبعلي',
      nameFr: 'Abdellah Nedbaali',
      tagAr: 'الأرشيف الرقمي وتوثيق الأنشطة بالصور والفيديو',
      tagFr: 'Archives numériques & Documentation',
      phone: '06 68 XX XX XX',
    },
    {
      roleAr: 'النائب الثاني لمسؤول التوثيق والإعلام',
      roleFr: '2ème Vice-Responsable Doc & Médias',
      nameAr: 'محمد صديقي',
      nameFr: 'Mohamed Seddiki',
      tagAr: 'التوثيق الميداني والتغطيات الإعلامية للفعاليات',
      tagFr: 'Documentation sur le terrain',
      phone: '06 69 XX XX XX',
    },
    {
      roleAr: 'مسؤولة التواصل',
      roleFr: 'Responsable Communication',
      nameAr: 'بشرى المرابط',
      nameFr: 'Bouchra El Mourabit',
      tagAr: 'التواصل الخارجي والعلاقات العامة مع الشركاء',
      tagFr: 'Relations publiques & Communication',
      phone: '06 70 XX XX XX',
      highlight: true
    },
    {
      roleAr: 'نائب مسؤولة التواصل',
      roleFr: 'Vice-Responsable Communication',
      nameAr: 'معاد أيت واحمان',
      nameFr: 'Mouad Ait Ouahmane',
      tagAr: 'نائب مسؤولة التواصل وصناعة المحتوى الرقمي',
      tagFr: 'Création de contenu & Digital',
      phone: '06 71 XX XX XX',
    },
    {
      roleAr: 'مستشارة',
      roleFr: 'Conseillère',
      nameAr: 'مليكة اهبور',
      nameFr: 'Malika Ahbour',
      tagAr: 'مستشارة المكتب للتنسيق والتوجيه الداخلي للأنشطة',
      tagFr: 'Conseil stratégique & Support',
      phone: '06 72 XX XX XX',
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-50/70 py-3 sm:py-6 px-2.5 sm:px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Main Bureau Card - Streamlined & Compact */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden">
          
          {/* Header with Club Logo - Compact Height */}
          <div className="pt-4 pb-3 sm:pt-6 sm:pb-4 px-3 sm:px-6 text-center bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100 relative">
            
            {/* STEP-AWARE BACK / RETURN BUTTON (زر العودة للخلف حسب المرحلة) */}
            <button
              onClick={handleGoBack}
              className="absolute top-3 sm:top-4.5 right-3 sm:right-5 rtl:right-auto rtl:left-3 rtl:sm:left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1C3F3A] hover:text-emerald-950 border border-amber-200/90 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
              title={
                selectedRoleId
                  ? (isFr ? 'Retour au choix du rôle' : 'الرجوع لاختيار الصفة')
                  : isAuthenticated
                  ? (isFr ? 'Retour au mot de passe' : 'الرجوع لشاشة كلمة السر')
                  : (isFr ? "Retour à l'accueil" : 'العودة للرئيسية')
              }
            >
              <ArrowRight className="w-4 h-4 text-[#1C3F3A] group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 rtl:rotate-180 transition-transform" />
              <span>
                {selectedRoleId || isAuthenticated
                  ? (isFr ? 'Retour' : (isTm ? 'ⵓⵖⵓⵍ' : 'رجوع للخلف'))
                  : (isFr ? 'Accueil' : (isTm ? 'ⵓⵖⵓⵍ' : 'العودة للرئيسية'))}
              </span>
            </button>

            <div className="flex justify-center mb-2">
              <img
                src="/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true';
                    target.src = '/public/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
                  }
                }}
                alt="نادي الثقافة الأمازيغية ببرشيد"
                referrerPolicy="no-referrer"
                style={{ mixBlendMode: 'multiply' }}
                className="h-10 sm:h-14 w-auto max-w-[240px] sm:max-w-xs object-contain"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-bold mb-1">
              {isAuthenticated ? (
                <Unlock className="w-3 h-3 text-emerald-600" />
              ) : (
                <Shield className="w-3 h-3 text-[#1C3F3A]" />
              )}
              <span>
                {isFr ? 'Portail Administratif Sécurisé' : (isTm ? 'ⵜⴰⵡⵡⵓⵔⵜ ⵏ ⵓⵙⵉⵔⴰ' : 'البوابة الإدارية الرسمية للمكتب')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isFr ? 'Bureau du Club de la Culture Amazighe' : (isTm ? 'ⴰⵙⵉⵔⴰ ⵏ ⵓⵙⵉⵔⴰⵎ ⵏ ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ' : 'فضاء المكتب الإداري والتنفيذي')}
            </h1>

            <p className="text-[11px] sm:text-xs text-slate-500 max-w-md mx-auto">
              {isFr
                ? 'Accès réservé exclusivement aux membres du bureau et à la direction du club.'
                : 'فضاء إداري خاص وحصري بأعضاء ومسؤولي المكتب المسير لنادي الثقافة الأمازيغية ببرشيد.'}
            </p>
          </div>

          {/* 3-Step Flow: Step 1 (Password First) -> Step 2 (Role Selection Second) -> Step 3 (Dedicated Role Portal) */}
          {!isAuthenticated ? (
            /* STEP 1: PASSWORD FIRST */
            <div className="p-6 sm:p-10 max-w-md mx-auto space-y-6 text-center animate-fade-in">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#1C3F3A] text-amber-300 flex items-center justify-center mx-auto shadow-md">
                  <FolderLock className="w-6 h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isFr ? 'Saisissez le mot de passe d\'accès' : 'أدخل كلمة المرور الخاصة بالمكتب'}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isFr
                    ? 'Entrez le mot de passe du bureau pour déverrouiller la sélection de fonction et le portail.'
                    : 'يرجى كتابة كلمة المرور المعتمدة لفتح مرحلة اختيار الصفة الإدارية والدخول للبوابة.'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 text-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isFr ? 'Mot de passe d\'accès *' : 'كلمة المرور الخاصة بالمكتب *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(false);
                      }}
                      placeholder={isFr ? 'Entrez le mot de passe...' : 'أدخل كلمة المرور هنا...'}
                      className={`w-full text-xs sm:text-sm p-3.5 pl-10 pr-10 rounded-xl border bg-white focus:outline-none transition-all shadow-xs ${
                        error
                          ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                          : 'border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] focus:border-[#1C3F3A]'
                      }`}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-slate-400 hover:text-slate-700 absolute right-2 rtl:right-auto rtl:left-2 top-2 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>
                      {isFr
                        ? 'Mot de passe incorrect. Veuillez saisir le mot de passe configuré.'
                        : 'كلمة المرور غير صحيحة، يرجى كتابة كلمة المرور المعتمدة.'}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs sm:text-sm font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>
                    {isFr ? 'Déverrouiller le Bureau' : 'فتح وبدء الدخول للمكتب'}
                  </span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          ) : !selectedRoleId ? (
            /* STEP 2: ROLE SELECTION SECOND */
            <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6 text-start animate-fade-in">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{isFr ? '2. Choisissez votre الصفة بالمكتب' : '2. اختر صفتك الإدارية ومسؤوليتك بالمكتب'}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  {isFr ? 'Sélection du Rôle & Portail Dédié' : 'اختر الصفة لفتح البوابة المخصصة لك'}
                </h2>
                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  {isFr
                    ? 'Cliquez sur votre fonction إدارية pour ouvrir directement votre بوابة العمل المخصصة.'
                    : 'انقر على الصفة التي تمثلها بالمكتب لفتح البوابة المخصصة لمسؤوليتك الإدارية بشكل مباشر.'}
                </p>
              </div>

              {/* Role Selection Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {BUREAU_ROLES.map((roleItem) => (
                  <div
                    key={roleItem.id}
                    onClick={() => handleSelectRole(roleItem)}
                    className="cursor-pointer p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-[#1C3F3A] hover:bg-emerald-50/40 hover:shadow-md transition-all duration-200 relative flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${roleItem.badgeColor}`}>
                          {isFr ? roleItem.roleFr : roleItem.roleAr}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#1C3F3A] group-hover:text-amber-300 text-slate-400 flex items-center justify-center transition-colors">
                          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                        </div>
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
                        {isFr ? roleItem.nameFr : roleItem.nameAr}
                      </h3>

                      <p className="text-[11px] text-slate-600 leading-snug mb-3">
                        {isFr ? roleItem.descriptionFr : roleItem.descriptionAr}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1C3F3A]">
                      <span>{isFr ? roleItem.gateFr : roleItem.gateAr}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                        {isFr ? 'Ouvrir la بوابة' : 'فتح البوابة'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 3: DEDICATED ROLE PORTAL */
            /* AUTHENTICATED BUREAU DASHBOARD */
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
              
              {/* Bureau Status Bar with Active Role Badge */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1C3F3A] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {isFr ? 'Session Bureau Active' : 'جلسة المكتب الإداري المفعلة'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300 shadow-2xs">
                        {isFr ? `${selectedRoleObj.roleFr} (${selectedRoleObj.nameFr})` : `${selectedRoleObj.roleAr} (${selectedRoleObj.nameAr})`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {isFr 
                        ? `Portail Ouvert: ${selectedRoleObj.gateFr} — Salon de chat accessible à tous les membres.`
                        : `البوابة المفتوحة: ${selectedRoleObj.gateAr} — مع إمكانية التنسيق مع جميع الأعضاء في الشات.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 flex-wrap">
                  <button
                    onClick={handleGoBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs transition-all cursor-pointer"
                    title={isFr ? "Retour au choix du rôle" : "الرجوع للخلف (اختيار الصفة)"}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-amber-900 rtl:rotate-180" />
                    <span>{isFr ? 'Retour' : 'رجوع للخلف'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title={isFr ? "Retour à l'accueil" : "الرجوع للصفحة الرئيسية"}
                  >
                    <span>{isFr ? 'Accueil' : 'الرئيسية'}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs transition-colors"
                    title="تغيير الصفة أو الخروج"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>{isFr ? 'Changer de rôle' : 'تغيير الصفة / خروج'}</span>
                  </button>

                  <button
                    onClick={() => setActiveBureauTab('settings')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                      activeBureauTab === 'settings'
                        ? 'bg-[#1C3F3A] text-white'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isFr ? 'Sécurité' : 'كلمة السر'}</span>
                  </button>
                </div>
              </div>

              {/* BUREAU TOP TABS NAVIGATION - STREAMLINED & COMPACT */}
              <div className="border-b border-slate-200">
                <nav className="flex space-x-1.5 rtl:space-x-reverse overflow-x-auto pb-2 scrollbar-none" aria-label="Tabs">
                  
                  {/* Tab 1: بوابة المنخرطين وواجب الانخراط (المطلوبة حديثاً من المستخدم) */}
                  <button
                    onClick={() => setActiveBureauTab('adherents')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'adherents'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 ${activeBureauTab === 'adherents' ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '1. Adhérents & Cotisations' : '1. بوابة المنخرطين (واجب الانخراط)'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeBureauTab === 'adherents' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {members.length}
                    </span>
                  </button>

                  {/* Tab 2: المالية والمحاسبة (أمين المال، إدخال وتصنيف المصاريف والمخططات البيانية Recharts) */}
                  <button
                    onClick={() => setActiveBureauTab('treasurer')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'treasurer'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Wallet className={`w-3.5 h-3.5 ${activeBureauTab === 'treasurer' ? 'text-emerald-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '2. Finance & Comptabilité' : '2. المالية والمحاسبة'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeBureauTab === 'treasurer' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {transactions.length}
                    </span>
                  </button>

                  {/* Tab 3: المكلف بنشر الإعلانات والمستجدات */}
                  <button
                    onClick={() => setActiveBureauTab('media')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'media'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Megaphone className={`w-3.5 h-3.5 ${activeBureauTab === 'media' ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '3. Publications & Médias' : '3. المكلف بنشر الإعلانات والمستجدات'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeBureauTab === 'media' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {effectiveAnnouncements.length}
                    </span>
                  </button>

                  {/* Tab 4: محادثة المكتب الداخلي المباشرة */}
                  <button
                    onClick={() => setActiveBureauTab('chat')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'chat'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className={`w-3.5 h-3.5 ${activeBureauTab === 'chat' ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '4. Chat Interne Bureau' : '4. محادثة أعضاء المكتب الداخلي'}</span>
                  </button>

                  {/* Tab 5: إدارة الآراء */}
                  <button
                    onClick={() => setActiveBureauTab('reviews')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'reviews'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MessageCircle className={`w-3.5 h-3.5 ${activeBureauTab === 'reviews' ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '5. Avis Visiteurs' : '5. إدارة الآراء'}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeBureauTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {reviews.length}
                    </span>
                  </button>

                  {/* Tab 5: تشكيلة أعضاء المكتب المسير */}
                  <button
                    onClick={() => setActiveBureauTab('members')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'members'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Users className={`w-3.5 h-3.5 ${activeBureauTab === 'members' ? 'text-sky-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '5. Membres du Bureau' : '5. تشكيلة أعضاء المكتب'}</span>
                  </button>

                  {/* Tab 6: إعدادات الأمان وكلمة السر */}
                  <button
                    onClick={() => setActiveBureauTab('settings')}
                    className={`flex items-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      activeBureauTab === 'settings'
                        ? 'bg-[#1C3F3A] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Key className={`w-3.5 h-3.5 ${activeBureauTab === 'settings' ? 'text-amber-300' : 'text-slate-500'}`} />
                    <span>{isFr ? '6. Sécurité' : '6. كلمة السر والأمان'}</span>
                  </button>

                </nav>
              </div>

              {/* TAB 1 CONTENT: بوابة المنخرطين وواجب الانخراط */}
              {activeBureauTab === 'adherents' && (
                <div className="animate-fade-in">
                  <MembersRegistrySection
                    members={mergedMembers}
                    onAddMember={handleAddMember}
                    onUpdateMember={handleUpdateMember}
                    onDeleteMember={handleDeleteMember}
                    onRecordFeeToTreasury={handleRecordFeeToTreasury}
                    currentLang={currentLang}
                    siteSettings={siteSettings}
                  />
                </div>
              )}

              {/* TAB 2 CONTENT: المالية والمحاسبة لأمين المال (إدخال وتصنيف المصاريف مع Recharts) */}
              {activeBureauTab === 'treasurer' && (
                <div className="animate-fade-in">
                  <TreasurerSection
                    transactions={transactions}
                    activityBudgets={activityBudgets}
                    onAddTransaction={handleAddTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onAddActivityBudget={handleAddActivityBudget}
                    onDeleteActivityBudget={handleDeleteActivityBudget}
                    onClearAllTreasurerData={handleClearAllTreasurerData}
                    currentLang={currentLang}
                  />
                </div>
              )}

              {/* TAB 3 CONTENT: المكلف بنشر الإعلانات والصور والمستجدات */}
              {activeBureauTab === 'media' && (
                <div className="animate-fade-in">
                  <MediaPublishingSection
                    announcements={effectiveAnnouncements}
                    onAddAnnouncement={handleAddAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                    currentLang={currentLang}
                  />
                </div>
              )}

              {/* TAB 4 CONTENT: محادثة المكتب الداخلي المباشرة مع جميع الأعضاء */}
              {activeBureauTab === 'chat' && (
                <div className="animate-fade-in space-y-3">
                  <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-medium">
                    <span className="flex items-center gap-1.5 font-bold">
                      <MessageSquare className="w-4 h-4 text-[#1C3F3A]" />
                      <span>{isFr ? 'Salon de Discussion Interne Ouvert à Tous les Membres du Bureau' : 'نافذة المحادثة الموحدة المفتوحة للتواصل والتنسيق بين جميع أعضاء المكتب'}</span>
                    </span>
                    <span className="bg-white px-2.5 py-0.5 rounded-full border border-amber-300 text-[10px] font-bold text-[#1C3F3A]">
                      {selectedRoleObj.roleAr} ({selectedRoleObj.nameAr})
                    </span>
                  </div>
                  <MembersChatPortal
                    currentLang={currentLang}
                    initialSenderName={selectedRoleObj.nameAr}
                    initialSenderRole={selectedRoleObj.roleAr}
                  />
                </div>
              )}

              {/* TAB 5 CONTENT: إدارة الآراء والتقييمات */}
              {activeBureauTab === 'reviews' && (
                <div className="animate-fade-in space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">
                      {isFr ? 'Gestion des avis des visiteurs' : 'إدارة ومراجعة آراء الزوار'}
                    </h3>
                    <button
                        onClick={handleClearAllReviews}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                    >
                        {isFr ? 'Supprimer tous les avis' : 'مسح جميع الآراء'}
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[#1C3F3A]">{r.visitorName}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full">{r.visitorRole}</span>
                            <span className="text-[10px] text-amber-500">{'★'.repeat(r.rating)}</span>
                          </div>
                          <p className="text-xs text-slate-600">{r.comment}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                          title={isFr ? 'Supprimer cet avis' : 'حذف الرأي'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4 CONTENT: تشكيلة أعضاء المكتب المسير */}
              {activeBureauTab === 'members' && (
                <div className="space-y-4 animate-fade-in text-start">
                  <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#1C3F3A]" />
                        <span>{isFr ? 'Composition du Bureau Exécutif' : 'التشكيلة الرسمية للمكتب التنفيذي'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isFr
                          ? 'Membres élus lors de l\'Assemblée Générale constitutive du Club de la Culture Amazighe à Berrechid.'
                          : 'الأعضاء المنتخبون خلال الجمع العام لنادي الثقافة الأمازيغية ببرشيد وتوزيع المهام الإدارية.'}
                      </p>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {isFr ? '12 Membres' : '12 عضواً مسيّراً'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {bureauMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          member.highlight
                            ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-300 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            member.highlight ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isFr ? member.roleFr : member.roleAr}
                          </span>
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1">
                          {isFr ? member.nameFr : member.nameAr}
                        </h4>

                        <p className="text-[11px] text-slate-600 mb-2 min-h-[28px] leading-snug">
                          {isFr ? member.tagFr : member.tagAr}
                        </p>

                        <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                          {member.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6 CONTENT: إعدادات الرئيس، الروابط، الواتساب، والآراء المحفوظة */}
              {activeBureauTab === 'settings' && (
                <div className="space-y-6 max-w-3xl mx-auto animate-fade-in text-start">
                  
                  {/* 1. SOCIAL MEDIA & WHATSAPP CONFIGURATION FORM (إعدادات الرئيس: تعديل الروابط والواتساب) */}
                  <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold mb-2 border border-amber-300">
                        <Share2 className="w-3.5 h-3.5 text-[#1C3F3A]" />
                        <span>{isFr ? 'Configuration des Réseaux & WhatsApp' : 'إعدادات الرئيس: تعديل روابط الفيسبوك والإنستغرام والواتساب'}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {isFr ? 'Mettre à jour les liens officiels du Club' : 'تحديث روابط التواصل الاجتماعي والرقم الرسمي'}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {isFr
                          ? 'Modifiez ici les liens Facebook, Instagram et le numéro WhatsApp qui s\'affichent sur le site web.'
                          : 'يمكن للرئيس أو المسؤول هنا تعديل رابط الفيسبوك ورابط الإنستغرام ورقم الواتساب وسيتم حفظها وتحديثها فوراً على الموقع.'}
                      </p>
                    </div>

                    {settingsSavedSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{isFr ? 'Les liens et paramètres ont été enregistrés avec succès !' : 'تم حفظ وتحديث الروابط ورقم الواتساب بنجاح في الموقع!'}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSiteSettings} className="space-y-4">
                      {/* Facebook Link */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Facebook className="w-4 h-4 text-[#1877F2]" />
                          <span>{isFr ? 'Lien Page Facebook Official:' : 'رابط صفحة الفيسبوك الرسمية للنادي:'}</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={siteSettings.facebookUrl}
                          onChange={(e) => setSiteSettings({ ...siteSettings, facebookUrl: e.target.value })}
                          placeholder="https://www.facebook.com/..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] transition-all"
                        />
                      </div>

                      {/* Instagram Link */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                          <Instagram className="w-4 h-4 text-[#E1306C]" />
                          <span>{isFr ? 'Lien Compte Instagram Official:' : 'رابط حساب الإنستغرام الرسمي للنادي:'}</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={siteSettings.instagramUrl}
                          onChange={(e) => setSiteSettings({ ...siteSettings, instagramUrl: e.target.value })}
                          placeholder="https://www.instagram.com/..."
                          className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] transition-all"
                        />
                      </div>

                      {/* WhatsApp Phone Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                            <span>{isFr ? 'Lien WhatsApp (wa.me/qr/...):' : 'رابط الواتساب المباشر (wa.me/qr/...):'}</span>
                          </label>
                          <input
                            type="url"
                            required
                            value={siteSettings.whatsappNumber}
                            onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                            placeholder="https://wa.me/qr/..."
                            className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] transition-all font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isFr ? 'Message WhatsApp par défaut:' : 'رسالة الواتساب الجاهزة:'}
                          </label>
                          <input
                            type="text"
                            value={siteSettings.whatsappMessage || ''}
                            onChange={(e) => setSiteSettings({ ...siteSettings, whatsappMessage: e.target.value })}
                            placeholder="مرحباً، أود الاستفسار حول أنشطة النادي..."
                            className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                        <span>{isFr ? 'Enregistrer les liens' : 'حفظ الروابط وإعدادات التواصل'}</span>
                      </button>
                    </form>
                  </div>

                  {/* 2. REVIEWS MANAGEMENT (مسح الآراء المحفوظة) */}
                  <div className="p-5 sm:p-7 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-rose-600" />
                          <span>{isFr ? 'Gestion des Avis & Témoignages' : 'إدارة ومسح الآراء والتقييمات المحفوظة'}</span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {isFr
                            ? 'Vous pouvez réinitialiser ou supprimer tous les avis visiteurs stockés dans la base de données.'
                            : 'يمكن للرئيس أو مسؤول الإدارة تفريغ أو مسح جميع الآراء والتقييمات المحفوظة في الموقع بضغطة زر.'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearAllReviews}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{isFr ? 'Supprimer tous les avis' : 'مسح جميع الآراء المحفوظة'}</span>
                      </button>
                    </div>

                    {clearReviewsSuccess && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{isFr ? 'Tous les avis ont été supprimés avec succès' : 'تم مسح جميع الآراء المحفوظة بنجاح من قاعدة البيانات والموقع!'}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. SECURITY & PASSWORD MANAGEMENT (إدارة كلمة المرور) */}
                  <div className="p-5 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#1C3F3A]" />
                        <span>{isFr ? 'Sécurité & Mot de Passe de l\'Espace' : 'إدارة كلمة المرور وحماية فضاء المكتب'}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isFr
                          ? 'En tant qu\'administrateur, vous pouvez définir un nouveau mot de passe strict ou réinitialiser le système.'
                          : 'بصفتك مسؤولاً إدارياً، يمكنك هنا تعيين كلمة مرور جديدة لحماية المكتب أو إعادة ضبطها.'}
                      </p>
                    </div>

                    {passwordChangeSuccess && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{isFr ? 'Mot de passe mis à jour avec succès !' : 'تم حفظ وتحديث كلمة المرور بنجاح!'}</span>
                      </div>
                    )}

                    {passwordChangeError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold animate-fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{passwordChangeError}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isFr ? 'Nouveau mot de passe *' : 'كلمة المرور الجديدة المعتمدة *'}
                          </label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={isFr ? 'Ex: Club2026@Amazigh' : 'مثال: كلمة سر خاصة بالمكتب...'}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {isFr ? 'Confirmer le nouveau mot de passe *' : 'تأكيد كلمة المرور الجديدة *'}
                          </label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={isFr ? 'Retapez le mot de passe...' : 'أعد كتابة كلمة المرور لتأكيدها...'}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                        <button
                          type="submit"
                          className="w-full sm:w-auto bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isFr ? 'Enregistrer le mot de passe' : 'حفظ كلمة المرور الجديدة'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetPasswordToAny}
                          className="text-slate-500 hover:text-slate-800 text-xs underline py-1"
                        >
                          {isFr ? 'Réinitialiser (Accès libre par défaut)' : 'إعادة ضبط (السماح بأي كلمة سر)'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* 4. INDIVIDUAL PORTAL PASSWORDS (كلمات سر بوابات أعضاء المكتب) */}
                  <div className="p-5 sm:p-7 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                        <FolderLock className="w-4 h-4 text-[#1C3F3A]" />
                        <span>{isFr ? 'Mots de passe individuels des portails (12)' : 'كلمات سر البوابات الفردية لأعضاء المكتب (12 بوابة)'}</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {isFr
                          ? 'Définissez un mot de passe unique pour chaque fonction/bوابة du bureau.'
                          : 'يمكنك تعيين أو تغيير كلمة المرور الخاصة بكل بوابة من بوابات أعضاء المكتب المسير على حدة (الافتراضي: 1234).'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                      {BUREAU_ROLES.map((roleItem) => {
                        const currentPwd = getRolePassword(roleItem.id);
                        return (
                          <div key={roleItem.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${roleItem.badgeColor}`}>
                                {isFr ? roleItem.roleFr : roleItem.roleAr}
                              </span>
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {isFr ? roleItem.nameFr : roleItem.nameAr}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                defaultValue={currentPwd}
                                onBlur={(e) => {
                                  if (e.target.value.trim()) {
                                    setRolePassword(roleItem.id, e.target.value.trim());
                                  }
                                }}
                                placeholder="كلمة السر..."
                                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]"
                                title="انقر لتعديل كلمة سر هذه البوابة"
                              />
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 font-bold shrink-0">
                                محمية
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}


            </div>
          )}

        </div>

      </div>

      {/* ROLE PASSWORD AUTHENTICATION MODAL (نافذة إدخال كلمة السر الخاصة بكل بوابة) */}
      {rolePasswordModalOpen && targetRoleForAuth && (
        <div className="fixed inset-0 z-50 bg-[#0d1c19]/70 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-start">
            <button
              onClick={() => setRolePasswordModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1C3F3A] text-amber-300 flex items-center justify-center mx-auto shadow-md">
                <Key className="w-6 h-6" />
              </div>
              <div className="inline-block px-3 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                {isFr ? targetRoleForAuth.roleFr : targetRoleForAuth.roleAr}
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {isFr ? `Mot de passe pour ${targetRoleForAuth.nameFr}` : `كلمة سر بوابة: ${targetRoleForAuth.nameAr}`}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isFr
                  ? 'Entrez le mot de passe spécifique à cette fonction pour accéder au portail.'
                  : 'أدخل كلمة المرور المخصصة لهذه البوابة الإدارية للوصول إليها (كلمة السر الافتراضية: CLUBAMAZIGHE@2026CLUBAMAZIGHE@2026).'}
              </p>
            </div>

            <form onSubmit={handleVerifyRolePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isFr ? 'Mot de passe de la بوابة *' : 'كلمة المرور الخاصة بهذه البوابة *'}
                </label>
                <div className="relative">
                  <input
                    type={showRolePassword ? 'text' : 'password'}
                    required
                    value={rolePasswordInput}
                    onChange={(e) => {
                      setRolePasswordInput(e.target.value);
                      if (rolePasswordError) setRolePasswordError(false);
                    }}
                    placeholder="CLUBAMAZIGHE@2026CLUBAMAZIGHE@2026"
                    className={`w-full text-xs sm:text-sm p-3.5 pl-10 pr-10 rounded-xl border bg-white focus:outline-none transition-all ${
                      rolePasswordError
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-2 focus:ring-[#1C3F3A]'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowRolePassword(!showRolePassword)}
                    className="p-2 text-slate-400 hover:text-slate-700 absolute right-2 rtl:right-auto rtl:left-2 top-2 transition-colors"
                  >
                    {showRolePassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {rolePasswordError && (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{isFr ? 'Mot de passe incorrect.' : 'كلمة المرور غير صحيحة لهذه البوابة.'}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRolePasswordModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all"
                >
                  {isFr ? 'Annuler' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isFr ? 'Accéder' : 'فتح البوابة'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
