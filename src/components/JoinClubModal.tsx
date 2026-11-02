import React, { useState } from 'react';
import { X, CheckCircle2, User, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Language } from './AmazighHeader';

interface JoinClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const JoinClubModal: React.FC<JoinClubModalProps> = ({ isOpen, onClose, currentLang }) => {
  if (!isOpen) return null;

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('cultural');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isFr = currentLang === 'fr';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[#1C3F3A] text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">
              {isFr ? 'Formulaire d\'Adhésion au Club' : 'استمارة الانخراط بنادي الثقافة الأمازيغية ببرشيد'}
            </h3>
            <p className="text-xs text-amber-200/80 mt-0.5">
              {isFr ? 'Rejoignez notre communauté culturelle' : 'انضم إلينا للمساهمة في تعزيز التراث والثقافة'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">
                {isFr ? 'Demande envoyée avec succès !' : 'تم إرسال طلب الانخراط بنجاح!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-6">
                {isFr
                  ? `Merci ${name || ''}. Le bureau du club vous contactera bientôt.`
                  : `شكراً لك ${name || ''}. سيتواصل معك مكتب النادي قريباً لتأكيد العضوية.`}
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#1C3F3A] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#142e2a] transition-colors"
              >
                {isFr ? 'Fermer' : 'إغلاق'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Nom et Prénom' : 'الاسم واللقب'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isFr ? 'Ex: Mohamed Amine' : 'مثال: محمد أمين'}
                    className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1C3F3A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFr ? 'Téléphone' : 'رقم الهاتف'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 XX XX XX XX"
                      className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1C3F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isFr ? 'E-mail' : 'البريد الإلكتروني'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full text-xs p-2.5 pl-9 rtl:pl-3 rtl:pr-9 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1C3F3A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Domaine d\'intérêt' : 'مجال الاهتمام والمشاركة'}
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#1C3F3A] bg-white text-slate-700"
                >
                  <option value="cultural">{isFr ? 'Activités culturelles et artistiques' : 'الأنشطة الثقافية والفنية'}</option>
                  <option value="language">{isFr ? 'Apprentissage de la langue Amazighe' : 'تعليم وتعلّم اللغة الأمازيغية (تيفيناغ)'}</option>
                  <option value="heritage">{isFr ? 'Recherche sur le patrimoine et l\'histoire' : 'البحث التراثي والتاريخي'}</option>
                  <option value="organization">{isFr ? 'Organisation d\'événements et festivals' : 'تنظيم الفعاليات والمهرجانات'}</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>{isFr ? 'Soumettre l\'adhésion' : 'إرسال طلب الانخراط'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
