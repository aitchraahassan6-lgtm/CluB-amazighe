import React, { useEffect, useState } from 'react';
import { Bell, X, ArrowUpRight, Megaphone, Calendar, Info } from 'lucide-react';
import { Announcement } from '../types/bureau';

interface ToastNotificationProps {
  announcement: Announcement | null;
  onClose: () => void;
  onViewAnnouncement?: (announcement: Announcement) => void;
  currentLang?: 'ar' | 'tm' | 'fr';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  announcement,
  onClose,
  onViewAnnouncement,
  currentLang = 'ar',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (announcement) {
      setIsVisible(true);
      setProgress(100);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 2) {
            clearInterval(interval);
            return 0;
          }
          return prev - 2;
        });
      }, 120);

      const timer = setTimeout(() => {
        handleClose();
      }, 6000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setIsVisible(false);
    }
  }, [announcement]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!announcement || !isVisible) return null;

  const getTypeBadge = () => {
    switch (announcement.category) {
      case 'event':
      case 'workshop':
        return {
          bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
          label: currentLang === 'ar' ? 'نشاط جديد' : currentLang === 'tm' ? 'ⴰⵎⵓⵙⵙⵓ ⴰⵎⴰⵢⵏⵓ' : 'Nouvel événement',
          icon: Calendar,
        };
      case 'announcement':
        return {
          bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
          label: currentLang === 'ar' ? 'إعلان جديد' : currentLang === 'tm' ? 'ⴰⵍⵖⵓ ⴰⵎⴰⵢⵏⵓ' : 'Nouvelle annonce',
          icon: Megaphone,
        };
      case 'statement':
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
          label: currentLang === 'ar' ? 'خبر جديد' : currentLang === 'tm' ? 'ⵉⵏⵖⵎⵉⵙⵏ ⵉⵎⴰⵢⵏⵓⵜⵏ' : 'Nouveau communiqué',
          icon: Info,
        };
    }
  };

  const badge = getTypeBadge();
  const IconComponent = badge.icon;

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}
      dir={currentLang === 'fr' ? 'ltr' : 'rtl'}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-200 dark:border-amber-900/50 shadow-2xl shadow-amber-900/20 p-4 sm:p-5">
        {/* Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

        <div className="flex items-start gap-3.5">
          {/* Animated Icon Bell */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          {/* Body Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${badge.bg}`}
              >
                <IconComponent className="w-3 h-3" />
                {badge.label}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {announcement.date}
              </span>
            </div>

            <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
              {announcement.title}
            </h4>

            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed mb-3">
              {announcement.description}
            </p>

            {/* Action button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onViewAnnouncement) {
                    onViewAnnouncement(announcement);
                  }
                  handleClose();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-3 py-1.5 rounded-lg transition-colors border border-amber-200/60 dark:border-amber-800/40"
              >
                <span>{currentLang === 'ar' ? 'عرض الخبر' : currentLang === 'tm' ? '⵰ⵕⵞⴰ' : 'Voir plus'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
