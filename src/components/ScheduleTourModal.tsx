import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, User, Mail, Phone, Home as HomeIcon, Video } from 'lucide-react';
import { Property } from '../types/property';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  currentLang: 'en' | 'ar';
}

export const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  currentLang,
}) => {
  if (!isOpen) return null;

  const isAr = currentLang === 'ar';
  const [tourType, setTourType] = useState<'in-person' | 'video'>('in-person');
  const [date, setDate] = useState('2026-11-05');
  const [time, setTime] = useState('14:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E6E0D6] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EDE6DC] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFEAE0] flex items-center justify-center text-[#8C6D46]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#0F223A] font-serif-display">
                {isAr ? 'حجز جولة استكشافية خاصة' : 'Schedule Private Tour'}
              </h3>
              {selectedProperty && (
                <p className="text-xs text-[#718096]">
                  {isAr ? selectedProperty.titleAr : selectedProperty.title}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#0F223A] hover:bg-[#EFEAE0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#0F223A] font-serif-display mb-2">
                {isAr ? 'تم تأكيد طلب الجولة بنجاح!' : 'Tour Request Confirmed!'}
              </h4>
              <p className="text-xs sm:text-sm text-[#5A6A80] max-w-sm mx-auto mb-6 leading-relaxed">
                {isAr
                  ? `شكراً لك يا ${name || 'عزيزنا العميل'}. سيتواصل معك مستشار إيفرلايت العقاري لتأكيد موعد الجولة في ${date} الساعة ${time}.`
                  : `Thank you, ${name || 'esteemed guest'}. Our senior property advisor will reach out to confirm your private viewing scheduled for ${date} at ${time}.`}
              </p>
              <button
                onClick={handleReset}
                className="bg-[#102238] hover:bg-[#1A3456] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow transition-colors"
              >
                {isAr ? 'إغلاق ومتابعة التصفح' : 'Close & Continue Browsing'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Tour Type Selector */}
              <div>
                <label className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-2">
                  {isAr ? 'نوع الجولة' : 'Viewing Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTourType('in-person')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      tourType === 'in-person'
                        ? 'bg-[#102238] text-white border-[#102238] shadow-sm'
                        : 'bg-white text-[#4A5568] border-[#DDD5C7] hover:border-[#8C6D46]'
                    }`}
                  >
                    <HomeIcon className="w-4 h-4" />
                    <span>{isAr ? 'جولة ميدانية مباشرة' : 'In-Person Private'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTourType('video')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      tourType === 'video'
                        ? 'bg-[#102238] text-white border-[#102238] shadow-sm'
                        : 'bg-white text-[#4A5568] border-[#DDD5C7] hover:border-[#8C6D46]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{isAr ? 'جولة فيديو 3D حية' : 'Live 3D Video Walk'}</span>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tour-date" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                    {isAr ? 'التاريخ المفضل' : 'Preferred Date'}
                  </label>
                  <input
                    id="tour-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368] text-[#0F223A]"
                  />
                </div>

                <div>
                  <label htmlFor="tour-time" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                    {isAr ? 'الوقت المفضل' : 'Preferred Time'}
                  </label>
                  <select
                    id="tour-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368] text-[#0F223A] bg-white"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label htmlFor="tour-fullname" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                    <input
                      id="tour-fullname"
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: محمد العمري' : 'e.g. Alexander Wright'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="tour-email" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                      <input
                        id="tour-email"
                        type="email"
                        required
                        placeholder="alex@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tour-phone" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                      <input
                        id="tour-phone"
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="tour-notes" className="block text-xs font-bold text-[#0F223A] uppercase tracking-wider mb-1">
                    {isAr ? 'ملاحظات إضافية أو استفسارات خاصة' : 'Special Inquiries (Optional)'}
                  </label>
                  <textarea
                    id="tour-notes"
                    rows={2}
                    placeholder={isAr ? 'أي متطلبات محددة...' : 'Specific questions or access arrangements...'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C7] focus:outline-none focus:ring-1 focus:ring-[#B89368]"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#102238] hover:bg-[#1A3456] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all mt-4"
              >
                {isAr ? 'تأكيد وحجز موعد الجولة' : 'Confirm & Request Tour Booking'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
