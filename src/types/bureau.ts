export interface Announcement {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  publisher: string;
  category: 'announcement' | 'event' | 'statement' | 'workshop';
  createdAt: string;
  publishToArchive?: boolean; // نشر في شريط الأرشيف المصور
  publishToWebsite?: boolean; // نشر في قسم منشورات وإعلانات الموقع الأسفل
  views?: number; // عدد المشاهدات الحقيقية
}

export interface FinancialTransaction {
  id: string;
  type: 'expense' | 'income';
  title: string; // اسم الوسيلة أو التجهيزات أو مصدر الدخل
  amount: number; // المبلغ بالدرهم المغربي
  category: string; // تجهيزات، طباعة، تنقل، تغذية، لوازم، انخراطات، دعم
  date: string;
  activity: string; // النشاط المرتبط
  notes?: string;
}

export interface ActivityBudget {
  id: string;
  title: string;
  allocatedBudget: number; // الميزانية المخصصة للنشاط
  spentAmount: number; // المصاريف الفعلية
  date: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface Member {
  id: string;
  name: string;
  cin?: string;
  filiere: string; // الشعبة الدراسية
  niveau: string; // المستوى (L1, L2, L3, Master)
  phone: string;
  email?: string;
  feeAmount: number; // واجب الانخراط بالدرهم (مثلا 50 درهم)
  feePaid: boolean; // هل تم أداء واجب الانخراط
  paidDate?: string;
  registeredDate: string;
  notes?: string;
  registrationSource: 'treasurer' | 'online_form'; // مدخل من قبل الأمين أو عبر استمارة الموقع
  approvalStatus?: 'pending' | 'approved' | 'rejected'; // حالة الموافقة الإدارية
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole?: string; // طالب، منخرط، عضو مكتب، أستاذ
  content: string;
  timestamp: string;
  createdAt: string;
  isOfficial?: boolean;
}

export interface VisitorReview {
  id: string;
  visitorName: string;
  visitorRole?: string; // أستاذ، طالب، منخرط، زائر
  rating: number; // 1 to 5 stars
  comment: string;
  date: string;
  createdAt: string;
}
