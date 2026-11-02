import { Announcement, FinancialTransaction, ActivityBudget, Member } from '../types/bureau';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'افتتاح الموسم الثقافي 2026 وانطلاق ورشات تعلم تيفيناغ',
    date: '2026-11-05',
    description: 'ينهي مكتب نادي الثقافة الأمازيغية ببرشيد إلى علم كافة المنخرطات والمنخرطين أن أولى ورشات تعليم حرف وقواعد تيفيناغ ستنطلق يوم السبت المقبل بدار الشباب برشيد على الساعة الثالثة بعد الزوال.',
    publisher: 'مسؤول الإعلام والتواصل - نادي الثقافة الأمازيغية',
    category: 'workshop',
    createdAt: '2026-11-01',
    publishToWebsite: true,
    publishToArchive: true,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'ann-2',
    title: 'ندوة فكرية حول تاريخ وتراث إقليم برشيد والشاوية',
    date: '2026-11-15',
    description: 'ينظم النادي ندوة أكاديمية بمشاركة أساتذة وباحثين في التاريخ والتراث اللامادي لتسليط الضوء على الخصوصيات التراثية واللغوية بجهة الدار البيضاء سطات.',
    publisher: 'لجنة الثقافة والأنشطة الفكرية',
    category: 'event',
    createdAt: '2026-11-01',
    publishToWebsite: true,
    publishToArchive: true,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [];

export const INITIAL_ACTIVITY_BUDGETS: ActivityBudget[] = [];

export const MOCK_MEMBER_IDS = [
  'CCAB-2026-1021',
  'CCAB-2026-1045',
  'CCAB-2026-1089',
  'CCAB-2026-1102',
  'CCAB-2026-1140'
];

export const MOCK_MEMBER_NAMES = [
  'ياسين أمرير',
  'خديجة أسكور',
  'أيوب تودرت',
  'سليمة إيزم',
  'حمزة أوتلغات'
];

export const INITIAL_MEMBERS: Member[] = [];

