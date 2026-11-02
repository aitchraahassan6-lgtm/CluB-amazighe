import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Shield,
  Sparkles,
  Users,
  Clock,
  BadgeCheck,
  Lock,
  Unlock,
  Key
} from 'lucide-react';
import { Language } from './AmazighHeader';
import { ChatMessage } from '../types/bureau';
import { subscribeChatMessages, sendChatMessageToFirebase } from '../lib/firebase';

interface MembersChatPortalProps {
  currentLang: Language;
  initialSenderName?: string;
  initialSenderRole?: string;
}

export const MembersChatPortal: React.FC<MembersChatPortalProps> = ({
  currentLang,
  initialSenderName,
  initialSenderRole
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState(initialSenderName || 'عضو المكتب');
  const [senderRole, setSenderRole] = useState(initialSenderRole || 'عضو المكتب التنفيذي');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if initial props change
  useEffect(() => {
    if (initialSenderName) setSenderName(initialSenderName);
    if (initialSenderRole) setSenderRole(initialSenderRole);
  }, [initialSenderName, initialSenderRole]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  const [processedLogoSrc, setProcessedLogoSrc] = useState<string | null>(null);

  // Clean background for Club Seal Logo
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 235 && g > 235 && b > 235) {
            data[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
        setProcessedLogoSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas transparency fallback:', err);
      }
    };

    img.onerror = () => {
      img.src = '/public/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
    };
  }, []);

  // Real-time listener for Chat Messages
  useEffect(() => {
    const unsubscribe = subscribeChatMessages((data) => {
      setMessages(data);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' });

    const chatMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderName: senderName.trim() || (isFr ? 'Membre du Bureau' : 'عضو المكتب'),
      senderRole: senderRole.trim() || (isFr ? 'Bureau Exécutif' : 'عضو المكتب التنفيذي'),
      content: newMessage.trim(),
      timestamp: timeStr,
      createdAt: now.toISOString(),
      isOfficial: true
    };

    try {
      await sendChatMessageToFirebase(chatMsg);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setNewMessage(promptText);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[580px] sm:h-[620px] animate-fade-in text-start">
      
      {/* CHAT HEADER & USER IDENTITY BAR */}
      <div className="bg-gradient-to-r from-[#1C3F3A] via-[#26534C] to-[#1C3F3A] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-300/40 p-1 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
            <img
              src={processedLogoSrc || '/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png'}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = 'true';
                  target.src = '/public/assets/aistudio/Capture_d__cran_2026-10-24_214828_6468c1cb.png';
                }
              }}
              alt="شعار نادي الثقافة الأمازيغية"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>{isFr ? 'Réseau Interne — Bureau Exécutif' : 'غرفة التنسيق الداخلي لأعضاء المكتب'}</span>
                <BadgeCheck className="w-4 h-4 text-amber-300 shrink-0" />
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{isFr ? 'Archivé & Sécurisé' : 'محفوظة دائماً ولا تُحذف'}</span>
              </span>
            </div>
            <p className="text-[11px] text-amber-100/80 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-300 inline" />
              <span>{messages.length} {isFr ? 'messages conservés dans l\'archive' : 'رسالة محفوظة سحابياً بصفة دائمة'}</span>
            </p>
          </div>
        </div>

        {/* IDENTITY MODIFIER BUTTON */}
        <div className="relative">
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white transition-all shadow-sm"
              title="تغيير صفة أو اسم عضو المكتب"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold">{senderName}</span>
              <span className="text-[10px] text-amber-200/80 font-normal">({senderRole})</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-amber-400/40 p-2 rounded-2xl shadow-xl text-xs">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="اسم العضو"
                className="bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-amber-400 w-28"
              />
              <input
                type="text"
                value={senderRole}
                onChange={(e) => setSenderRole(e.target.value)}
                placeholder="الصفة (رئيس، أمين المال...)"
                className="bg-slate-800 text-white px-2.5 py-1 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-amber-400 w-32"
              />
              <button
                onClick={() => setIsEditingProfile(false)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3 py-1 rounded-lg text-xs transition-colors"
              >
                حفظ
              </button>
            </div>
          )}
        </div>

      </div>

      {/* MESSAGES STREAM AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF7EE]/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Users className="w-12 h-12 mb-2 text-slate-300 animate-bounce" />
            <p className="text-sm font-bold text-slate-600">
              {isFr ? 'Aucun message pour le moment dans le chat du bureau.' : 'لا توجد رسائل سابقة. ابدأ المحادثة مع باقي أعضاء المكتب!'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUserMsg = msg.senderName === senderName;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUserMsg ? 'items-end' : 'items-start'} transition-all`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-600 inline" />
                    {msg.senderName}
                  </span>
                  {msg.senderRole && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                      {msg.senderRole}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                    isUserMsg
                      ? 'bg-[#1C3F3A] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK PROMPTS CHIPS */}
      <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 flex-shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isFr ? 'Suggestions:' : 'عبارات سريعة للمكتب:'}</span>
        </span>
        {[
          'أزول مَارَّا ⵣ - تحياتي لأعضاء المكتب',
          'تم تحديد موعد الاجتماع القادم للمكتب',
          'يرجى مراجعة ميزانية النشاط الجديد',
          'تم تحديث القائمة النهائية للمنخرطين'
        ].map((text, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(text)}
            className="flex-shrink-0 text-[11px] bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-2.5 py-1 rounded-full transition-colors border border-slate-200/80"
          >
            {text}
          </button>
        ))}
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-white border-t border-[#E5DEC9] flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            isFr
              ? 'Écrivez un message interne au bureau...'
              : `اكتب رسالتك لأعضاء المكتب يا ${senderName}...`
          }
          className="flex-1 bg-slate-50 border border-slate-300/80 focus:border-[#1C3F3A] rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
        />

        <button
          type="submit"
          disabled={!newMessage.trim() || isSubmitting}
          className="bg-[#1C3F3A] hover:bg-[#15302c] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 sm:px-6 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <span>{isFr ? 'Envoyer' : 'إرسال'}</span>
          <Send className="w-4 h-4 rtl:-scale-x-100" />
        </button>
      </form>

    </div>
  );
};
