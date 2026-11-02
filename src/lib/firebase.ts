import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  getDocs,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  Announcement,
  FinancialTransaction,
  ActivityBudget,
  Member,
  ChatMessage,
  VisitorReview
} from '../types/bureau';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ACTIVITY_BUDGETS,
  INITIAL_MEMBERS,
  MOCK_MEMBER_IDS,
  MOCK_MEMBER_NAMES
} from '../data/bureauData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Operation types for error reporting
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  const isQuotaExceeded = message.toLowerCase().includes('quota') || message.includes('8 RESOURCE_EXHAUSTED');

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isQuotaExceeded) {
    console.warn('Firestore Quota Exceeded for:', operationType, path, '- Falling back to local data if available.');
    // Don't throw for GET/LIST operations to prevent app crash when quota hits
    if (operationType === OperationType.GET || operationType === OperationType.LIST) {
      return; 
    }
  }

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial default seed for Chat Messages
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderName: 'مكتب نادي الثقافة الأمازيغية',
    senderRole: 'إدارة النادي',
    content: 'مرحباً بكم جميعاً في بوابة محادثة وتبادل الأفكار بين أعضاء ومنخرطي النادي ببرشيد! ⵣ',
    timestamp: '10:30 ص',
    createdAt: new Date().toISOString(),
    isOfficial: true
  },
  {
    id: 'msg-2',
    senderName: 'عبد الواحد أيت سعيد',
    senderRole: 'أمين المال',
    content: 'السلام عليكم، باب الانخراط وتجديد العضوية مفتوح لجميع الطلبة والمهتمين بالموسم الثقافي.',
    timestamp: '11:15 ص',
    createdAt: new Date().toISOString()
  },
  {
    id: 'msg-3',
    senderName: 'خديجة أباغوغ',
    senderRole: 'الكاتبة العامة',
    content: 'مرحباً بالجميع، تم تحديث سجل المنخرطين والبطاقات والوصولات الرسمية.',
    timestamp: '11:20 ص',
    createdAt: new Date().toISOString()
  }
];

// Initial default seed for Visitor Reviews (empty by default)
const INITIAL_VISITOR_REVIEWS: VisitorReview[] = [];

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
// testConnection();

// Initialize initial seed data if collections are empty
async function seedInitialDataIfEmpty() {
  try {
    const annSnap = await getDocs(collection(db, 'announcements'));
    if (annSnap.empty) {
      for (const ann of INITIAL_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', ann.id), ann);
      }
    }

    const txSnap = await getDocs(collection(db, 'transactions'));
    if (txSnap.empty) {
      for (const tx of INITIAL_TRANSACTIONS) {
        await setDoc(doc(db, 'transactions', tx.id), tx);
      }
    }

    const budgetSnap = await getDocs(collection(db, 'activityBudgets'));
    if (budgetSnap.empty) {
      for (const b of INITIAL_ACTIVITY_BUDGETS) {
        await setDoc(doc(db, 'activityBudgets', b.id), b);
      }
    }

    const memSnap = await getDocs(collection(db, 'members'));
    if (memSnap.empty) {
      for (const m of INITIAL_MEMBERS) {
        await setDoc(doc(db, 'members', m.id), m);
      }
    }

    const chatSnap = await getDocs(collection(db, 'chatMessages'));
    if (chatSnap.empty) {
      for (const msg of INITIAL_CHAT_MESSAGES) {
        await setDoc(doc(db, 'chatMessages', msg.id), msg);
      }
    }

    const revSnap = await getDocs(collection(db, 'visitorReviews'));
    if (revSnap.empty) {
      for (const rev of INITIAL_VISITOR_REVIEWS) {
        await setDoc(doc(db, 'visitorReviews', rev.id), rev);
      }
    }
  } catch (err) {
    console.warn('Initial seeding note:', err);
  }
}
// seedInitialDataIfEmpty();

// --- 1. ANNOUNCEMENTS FIRESTORE REAL-TIME API ---
export function subscribeAnnouncements(callback: (items: Announcement[]) => void) {
  const path = 'announcements';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Announcement[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Announcement);
      });
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveAnnouncementToFirebase(announcement: Announcement) {
  const path = `announcements/${announcement.id}`;
  try {
    await setDoc(doc(db, 'announcements', announcement.id), announcement);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAnnouncementFromFirebase(id: string) {
  const path = `announcements/${id}`;
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function incrementAnnouncementViewsInFirebase(id: string) {
  const path = `announcements/${id}`;
  try {
    const docRef = doc(db, 'announcements', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const currentViews = typeof data.views === 'number' ? data.views : 0;
      await setDoc(docRef, { ...data, views: currentViews + 1 }, { merge: true });
    }
  } catch (error) {
    console.warn('Error incrementing announcement views:', error);
  }
}

// --- 2. TRANSACTIONS FIRESTORE REAL-TIME API ---
export function subscribeTransactions(callback: (items: FinancialTransaction[]) => void) {
  const path = 'transactions';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: FinancialTransaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as FinancialTransaction);
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveTransactionToFirebase(tx: FinancialTransaction) {
  const path = `transactions/${tx.id}`;
  try {
    await setDoc(doc(db, 'transactions', tx.id), tx);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTransactionFromFirebase(id: string) {
  const path = `transactions/${id}`;
  try {
    await deleteDoc(doc(db, 'transactions', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- 3. ACTIVITY BUDGETS FIRESTORE REAL-TIME API ---
export function subscribeActivityBudgets(callback: (items: ActivityBudget[]) => void) {
  const path = 'activityBudgets';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ActivityBudget[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as ActivityBudget);
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveActivityBudgetToFirebase(budget: ActivityBudget) {
  const path = `activityBudgets/${budget.id}`;
  try {
    await setDoc(doc(db, 'activityBudgets', budget.id), budget);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteActivityBudgetFromFirebase(id: string) {
  const path = `activityBudgets/${id}`;
  try {
    await deleteDoc(doc(db, 'activityBudgets', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- 4. MEMBERS FIRESTORE REAL-TIME API ---
export function subscribeMembers(callback: (items: Member[]) => void) {
  const path = 'members';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: Member[] = [];
      snapshot.forEach((docSnap) => {
        const id = docSnap.id;
        const data = docSnap.data() as Member;
        const isMock = MOCK_MEMBER_IDS.includes(id) || MOCK_MEMBER_NAMES.includes(data.name);
        if (!isMock) {
          items.push({ ...data, id });
        } else {
          // Asynchronously purge fake mock member from database so it doesn't linger
          deleteDoc(doc(db, 'members', id)).catch(() => {});
        }
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function findMemberByCode(code: string): Promise<Member | null> {
  const clean = code.trim().toUpperCase();
  const digits = code.replace(/\D/g, '');
  try {
    const snap = await getDocs(collection(db, 'members'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as Member;
      const mId = docSnap.id.toUpperCase();
      if (!MOCK_MEMBER_IDS.includes(docSnap.id) && !MOCK_MEMBER_NAMES.includes(data.name)) {
        if (mId === clean || mId.includes(clean)) return { ...data, id: docSnap.id };
        if (digits.length >= 3 && mId.replace(/\D/g, '').includes(digits)) return { ...data, id: docSnap.id };
        if (data.cin && data.cin.toUpperCase() === clean) return { ...data, id: docSnap.id };
        if (data.phone && digits.length >= 6 && data.phone.replace(/\D/g, '').includes(digits)) return { ...data, id: docSnap.id };
      }
    }
  } catch (e) {
    console.warn('findMemberByCode note:', e);
  }
  return null;
}

export async function saveMemberToFirebase(member: Member) {
  const path = `members/${member.id}`;
  try {
    await setDoc(doc(db, 'members', member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberFromFirebase(id: string) {
  const path = `members/${id}`;
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- 5. MEMBERS CHAT PORTAL FIRESTORE REAL-TIME API ---
export function subscribeChatMessages(callback: (items: ChatMessage[]) => void) {
  const path = 'chatMessages';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: ChatMessage[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as ChatMessage);
      });
      // Sort chronologically ascending for chat stream
      items.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function sendChatMessageToFirebase(msg: ChatMessage) {
  const path = `chatMessages/${msg.id}`;
  try {
    await setDoc(doc(db, 'chatMessages', msg.id), msg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteChatMessageFromFirebase(id: string) {
  const path = `chatMessages/${id}`;
  try {
    await deleteDoc(doc(db, 'chatMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- 6. VISITOR REVIEWS & RATINGS FIRESTORE REAL-TIME API ---
export function subscribeVisitorReviews(callback: (items: VisitorReview[]) => void) {
  const path = 'visitorReviews';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const items: VisitorReview[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as VisitorReview);
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function addVisitorReviewToFirebase(review: VisitorReview) {
  const path = `visitorReviews/${review.id}`;
  try {
    await setDoc(doc(db, 'visitorReviews', review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteVisitorReviewFromFirebase(id: string) {
  const path = `visitorReviews/${id}`;
  try {
    await deleteDoc(doc(db, 'visitorReviews', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Site Settings Interface
export interface SiteSettings {
  facebookUrl: string;
  instagramUrl: string;
  whatsappNumber: string;
  whatsappMessage?: string;
  clubNameAr?: string;
  clubNameFr?: string;
  clubLogoUrl?: string;
  schoolLogoUrl?: string;
  stampUrl?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  facebookUrl: 'https://www.facebook.com/profile.php?id=61556778545729',
  instagramUrl: 'https://www.instagram.com/club_de_la_culture_amazighe?obrf=MTk2MGc5bTBnb3duaw==',
  whatsappNumber: 'https://wa.me/qr/BOP47UFMAMAWC1',
  whatsappMessage: 'مرحباً، أود الاستفسار حول أنشطة وانخراط نادي الثقافة الأمازيغية ببرشيد',
  clubNameAr: 'نادي الثقافة الأمازيغية ببرشيد',
  clubNameFr: 'Club de la Culture Amazighe Berrechid',
  clubLogoUrl: '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png',
  schoolLogoUrl: '/assets/aistudio/image_e594bc88.png',
  stampUrl: '/assets/aistudio/IMG_20261102_010400_c0845ab1.jpg'
};

// --- 7. SITE SETTINGS FIRESTORE REAL-TIME API ---
export function subscribeSiteSettings(callback: (settings: SiteSettings) => void) {
  const path = 'settings/siteConfig';
  return onSnapshot(
    doc(db, 'settings', 'siteConfig'),
    (docSnap) => {
      if (docSnap.exists()) {
        const raw = docSnap.data() as Partial<SiteSettings>;
        const merged: SiteSettings = {
          ...DEFAULT_SITE_SETTINGS,
          ...raw,
          clubLogoUrl: (raw.clubLogoUrl && raw.clubLogoUrl.trim() !== '' && !raw.clubLogoUrl.includes('wikimedia'))
            ? raw.clubLogoUrl
            : DEFAULT_SITE_SETTINGS.clubLogoUrl,
          schoolLogoUrl: (raw.schoolLogoUrl && raw.schoolLogoUrl.trim() !== '')
            ? raw.schoolLogoUrl
            : DEFAULT_SITE_SETTINGS.schoolLogoUrl,
          stampUrl: (raw.stampUrl && raw.stampUrl.trim() !== '')
            ? raw.stampUrl
            : DEFAULT_SITE_SETTINGS.stampUrl,
        };
        callback(merged);
      } else {
        callback(DEFAULT_SITE_SETTINGS);
      }
    },
    (error) => {
      console.warn('Site settings snapshot notice:', error);
      callback(DEFAULT_SITE_SETTINGS);
    }
  );
}

export async function saveSiteSettingsToFirebase(settings: SiteSettings) {
  const path = 'settings/siteConfig';
  try {
    await setDoc(doc(db, 'settings', 'siteConfig'), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function clearAllVisitorReviewsFromFirebase() {
  const path = 'visitorReviews';
  try {
    const snapshot = await getDocs(collection(db, path));
    const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(db, path, d.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

