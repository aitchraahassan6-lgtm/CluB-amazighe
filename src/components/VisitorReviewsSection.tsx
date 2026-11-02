import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
  Heart
} from 'lucide-react';
import { Language } from './AmazighHeader';
import { VisitorReview } from '../types/bureau';
import {
  subscribeVisitorReviews,
  addVisitorReviewToFirebase
} from '../lib/firebase';

interface VisitorReviewsSectionProps {
  currentLang: Language;
}

export const VisitorReviewsSection: React.FC<VisitorReviewsSectionProps> = ({
  currentLang
}) => {
  const [reviews, setReviews] = useState<VisitorReview[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Real-time listener for Visitor Reviews from Firestore
  useEffect(() => {
    const unsubscribe = subscribeVisitorReviews((data) => {
      setReviews(data);
    });
    return () => unsubscribe();
  }, []);

  // Filter out specified names as requested by user
  const filteredReviews = reviews.filter((rev) => {
    const n = (rev.visitorName || '').trim();
    if (
      n.includes('عبد الله البوزيدي') ||
      n.includes('مريم أيت أوراحو') ||
      n.includes('رشيد السملالي') ||
      n.includes('البوزيدي') ||
      n.includes('أوراحو') ||
      n.includes('السملالي')
    ) {
      return false;
    }
    return true;
  });

  // Compute live rating metrics
  const totalReviews = filteredReviews.length;
  const averageRating = totalReviews > 0
    ? (filteredReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const today = new Date().toISOString().split('T')[0];

    const newReview: VisitorReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      visitorName: name.trim(),
      visitorRole: role.trim() || (isFr ? 'Visiteur' : 'زائر النادي'),
      rating: rating,
      comment: comment.trim(),
      date: today,
      createdAt: new Date().toISOString()
    };

    try {
      await addVisitorReviewToFirebase(newReview);
      setName('');
      setRole('');
      setComment('');
      setRating(5);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 4000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="w-full py-14 sm:py-18 px-4 sm:px-8 bg-gradient-to-b from-white via-[#FAF7EE] to-white border-b border-[#E5DEC9]">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-black mb-3 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              {isFr
                ? 'Avis et Témoignages'
                : (isTm ? 'ⵜⵉⵏⴰⵡⵉⵏ ⴷ ⵓⵎⵙⴰⵡⴰⵍ' : 'آراء وتقييمات الزوار والمنخرطين')}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2.5">
            <span>
              {isFr ? 'Ce que disent nos visiteurs et adhérents' : 'ماذا يقول زوار وأعضاء نادي الثقافة الأمازيغية؟'}
            </span>
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            {isFr
              ? 'Découvrez les retours d\'expérience des étudiants, enseignants et visiteurs sur nos activités et ateliers culturels.'
              : 'آراء وتقييمات حقيقية من الطلبة والأساتذة الباحثين والزوار حول أنشطة النادي وورشاته ببرشيد.'}
          </p>
        </div>

        {/* TOP SUMMARY STATS & FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* LEFT/RIGHT 1: SCORE CARD & SUBMISSION FORM (5 COLS) */}
          <div className="lg:col-span-5 bg-white border border-[#E5DEC9] rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            
            {/* SCORE DISPLAY */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono">
                  {averageRating}
                </span>
                <span className="text-xl font-bold text-slate-400">/ 5</span>
              </div>

              {/* STAR ICONS */}
              <div className="flex items-center justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs font-bold text-slate-500">
                {isFr
                  ? `Basé sur ${totalReviews} avis publiés`
                  : `بناءً على ${totalReviews} تقييم مسجل لدى النادي`}
              </p>
            </div>

            {/* INTERACTIVE FORM */}
            <form onSubmit={handleAddReview} className="mt-6 space-y-4 text-start">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-emerald-700" />
                <span>{isFr ? 'Ajoutez votre avis' : 'أضف رأيك وتقييمك للنادي'}</span>
              </h3>

              {/* RATING SELECTOR */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isFr ? 'Votre Note (على كم تقيم النادي؟):' : 'التقييم بالنجوم:'}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-700 font-mono mr-2">
                    ({hoverRating || rating} / 5)
                  </span>
                </div>
              </div>

              {/* VISITOR NAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Nom Complet:' : 'الاسم الكامل:'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isFr ? 'Ex: Mohamed Amrani' : 'مثال: الأستاذ حمزة / مريم'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F3A] transition-all"
                />
              </div>

              {/* VISITOR ROLE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Qualité / Rôle:' : 'الصفة أو الصفة العلمية:'}
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder={isFr ? 'Ex: Étudiant ESEFB, Professeur...' : 'مثال: أستاذ باحث، طالب بكلية التربية والتكوين...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F3A] transition-all"
                />
              </div>

              {/* COMMENT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isFr ? 'Votre Commentaire:' : 'رأيك وانطباعك:'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isFr ? 'Votre avis sur les activités du club...' : 'اكتب انطباعك أو كلمة مشجعة لأعضاء النادي...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#1C3F3A] transition-all"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !comment.trim()}
                className="w-full bg-gradient-to-r from-[#1C3F3A] to-[#26534C] hover:from-[#142e2a] hover:to-[#1C3F3A] disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{isFr ? 'Publier mon avis' : 'نشر التقييم والرأي'}</span>
                <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
              </button>
            </form>

            {/* SUCCESS MODAL / BADGE */}
            {showSuccessModal && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {isFr
                    ? 'Merci! Votre avis a été enregistré avec succès.'
                    : 'شكراً لك! تم نشر رأيك وتقييمك بنجاح في الموقع.'}
                </span>
              </div>
            )}

          </div>

          {/* RIGHT 2: REVIEWS REEL & CARDS (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>
                  {isFr ? 'الشهادات والتقييمات الأخيرة' : 'الشهادات والتقييمات المسجلة'}
                </span>
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
                  {filteredReviews.length} {isFr ? 'Avis' : 'رأي'}
                </span>
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
              {filteredReviews.length === 0 ? (
                <div className="bg-white border border-[#E5DEC9] border-dashed rounded-2xl p-8 text-center text-slate-500 shadow-sm">
                  <MessageSquareQuote className="w-10 h-10 text-amber-500/70 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">
                    {isFr ? 'Aucun avis publié pour le moment' : 'لا توجد آراء مسجلة حتى الآن'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
                    {isFr
                      ? 'Soyez le premier à donner votre avis via le formulaire ci-contre !'
                      : 'كن أول من يشارك رأيه وانطباعه حول أنشطة النادي ببرشيد باستخدام استمارة إضافة الرأي.'}
                  </p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-[#E5DEC9] hover:border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all text-start group relative"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        {/* Avatar Circle */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                          {rev.visitorName ? rev.visitorName.charAt(0) : 'ز'}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#1C3F3A] transition-colors">
                            {rev.visitorName}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {rev.visitorRole || 'زائر النادي'}
                          </p>
                        </div>
                      </div>

                      {/* STARS */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/80">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line pl-1">
                      "{rev.comment}"
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400 fill-current" />
                        <span>{isFr ? 'Avis vérifié' : 'تقييم موثق'}</span>
                      </span>
                      <span className="font-mono">{rev.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
