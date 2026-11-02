import React, { useState } from 'react';
import { Announcement } from '../types/bureau';
import { Language } from './AmazighHeader';
import {
  Megaphone,
  Calendar,
  Tag,
  Building2,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Images,
  Eye,
  BadgeCheck,
  Search,
} from 'lucide-react';
import { incrementAnnouncementViewsInFirebase } from '../lib/firebase';

interface PublicAnnouncementsSectionProps {
  announcements: Announcement[];
  currentLang: Language;
}

/* Sub-component for interactive swipable / arrow multi-photo carousel */
const AnnouncementImageGallery: React.FC<{
  images: string[];
  title: string;
  isRtl: boolean;
  className?: string;
  isModal?: boolean;
}> = ({ images, title, isRtl, className = '', isModal = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative w-full bg-[#FAF7EE] overflow-hidden flex items-center justify-center group ${className}`}>
      {/* Current Image with object-cover to fill the card */}
      <img
        src={images[currentIndex]}
        alt={`${title} ${currentIndex + 1}`}
        className={`w-full transition-all duration-300 ${
          isModal ? 'object-contain h-auto max-h-[550px] bg-[#faf7ee]' : 'object-cover w-full h-72 sm:h-96 bg-slate-100'
        }`}
        loading="eager"
        decoding="async"
      />

      {/* Multiple Photos Controls & Badge */}
      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={isRtl ? handleNext : handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1C3F3A]/80 hover:bg-[#1C3F3A] text-white flex items-center justify-center transition-all shadow-md backdrop-blur-xs"
            title="الصورة السابقة"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={isRtl ? handlePrev : handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#1C3F3A]/80 hover:bg-[#1C3F3A] text-white flex items-center justify-center transition-all shadow-md backdrop-blur-xs"
            title="الصورة التالية"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Photo Count Counter */}
          <div className="absolute bottom-3 left-3 z-10 bg-[#1C3F3A]/90 backdrop-blur-sm text-amber-200 text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-amber-300/30 shadow-md">
            <Images className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Pagination Indicators / Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-5 bg-[#1C3F3A]' : 'w-1.5 bg-[#1C3F3A]/40 hover:bg-[#1C3F3A]'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const PublicAnnouncementsSection: React.FC<PublicAnnouncementsSectionProps> = ({
  announcements = [],
  currentLang
}) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isRtl = currentLang === 'ar';
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Filter announcements intended for website display
  const websiteAnnouncements = announcements.filter((ann) => ann.publishToWebsite !== false);

  // Category labels
  const categoryLabels: Record<string, { ar: string; fr: string; tm: string }> = {
    announcement: { ar: 'إعلان عام', fr: 'Annonce Générale', tm: 'ⵜⵓⵙⵉⵔⵜ' },
    event: { ar: 'تظاهرة وندوة', fr: 'Événement Culturel', tm: 'ⴰⵎⵓⵙⵙⵓ' },
    workshop: { ar: 'ورشة تكوينية', fr: 'Atelier Formation', tm: 'ⵜⴰⵙⵉⵍⴰ' },
    statement: { ar: 'بيان رسمي', fr: 'Communiqué Officiel', tm: 'ⴰⵍⵖⵓ' }
  };

  // Filtered by selected tab category and search query
  const filteredAnnouncements = websiteAnnouncements.filter((ann) => {
    const matchesCategory = activeCategoryFilter === 'all' || ann.category === activeCategoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      ann.title.toLowerCase().includes(query) ||
      ann.description.toLowerCase().includes(query) ||
      ann.publisher.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full bg-gradient-to-b from-white via-[#faf7ee]/40 to-[#f8f5ee] py-12 sm:py-16 px-4 border-b border-[#e5dec9]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-black shadow-xs">
            <span className="text-sm font-black text-[#B82B2B]">ⵣ</span>
            <span>
              {isFr
                ? 'Actualités & Publications Officielles'
                : (isTm ? 'ⵉⵏⵖⵎⵉⵙⵏ ⴷ ⵜⵉⵙⵉⵔⵉⵏ ⵜⵉⵎⴰⴷⴷⵓⴷⵉⵏ' : 'مستجدات وإعلانات النادي الرسمية')}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isFr
              ? 'Dernières Annonces du Bureau Exécutif'
              : (isTm ? 'ⵜⵉⵙⵉⵔⵉⵏ ⵜⵉⵏⴰⵎⵎⴰⵙⵉⵏ ⵏ ⵓⵙⵉⵔⴰⵎ' : 'أحدث الإعلانات والتظاهرات المنشورة')}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {isFr
              ? 'Restez informé de nos ateliers, conférences, célébrations et comunicatés officiels.'
              : 'تابع مواعيد الورشات التكوينية، الندوات الأكاديمية والأنشطة الثقافية ببرشيد فور نشرها.'}
          </p>
        </div>

        {/* SEARCH BAR (شريط البحث) */}
        <div className="max-w-xl mx-auto relative">
          <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFr ? 'Rechercher une annonce par titre ou contenu...' : 'ابحث في المنشورات والإعلانات حسب العنوان أو المحتوى...'}
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A]/30 focus:border-[#1C3F3A] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              إلغاء
            </button>
          )}
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              activeCategoryFilter === 'all'
                ? 'bg-[#1C3F3A] text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isFr ? 'Toutes les publications' : 'جميع الإعلانات والمستجدات'} ({websiteAnnouncements.length})
          </button>

          {(['announcement', 'event', 'workshop', 'statement'] as const).map((catKey) => {
            const count = websiteAnnouncements.filter((a) => a.category === catKey).length;
            if (count === 0) return null;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategoryFilter(catKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  activeCategoryFilter === catKey
                    ? 'bg-[#1C3F3A] text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-3 h-3 text-amber-500" />
                <span>{isFr ? categoryLabels[catKey].fr : categoryLabels[catKey].ar}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCategoryFilter === catKey ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ANNOUNCEMENTS CARDS GRID */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              {isFr ? 'Aucune publication dans cette catégorie.' : 'لا توجد منشورات حالياً في هذا التصنيف.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((ann) => {
              const allImages = ann.imageUrls && ann.imageUrls.length > 0 ? ann.imageUrls : (ann.imageUrl ? [ann.imageUrl] : []);

              const handleOpenAnnouncement = () => {
                setSelectedAnnouncement(ann);
                incrementAnnouncementViewsInFirebase(ann.id);
              };

              return (
                <article
                  key={ann.id}
                  onClick={handleOpenAnnouncement}
                  className="group bg-white rounded-none sm:rounded-2xl border-x-0 sm:border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer -mx-4 sm:mx-0"
                >
                  <div>
                    {/* Club Header (Date slightly above/in header, Club Icon, Club Name, Facebook Verified Badge) */}
                    <div className="p-3.5 sm:p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1C3F3A]/10 border border-[#1C3F3A]/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img
                            src="/assets/aistudio/Capture_d__cran_2026-10-24_220552_169ba541.png"
                            alt="شعار نادي الثقافة الأمازيغية ببرشيد"
                            className="w-8 h-8 object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              {isFr ? 'Club de la Culture Amazighe' : 'نادي الثقافة الأمازيغية ببرشيد'}
                            </span>
                            {/* Facebook Verified Badge */}
                            <span className="inline-flex items-center justify-center text-[#1877F2]" title="حساب رسمي موثق">
                              <BadgeCheck className="w-4 h-4 fill-[#1877F2] text-white" />
                            </span>
                          </div>
                          {/* Date slightly above / in header */}
                          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-[#B82B2B]" />
                            <span>{ann.date}</span>
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-950 text-[10px] font-extrabold border border-amber-300/50">
                        {isFr ? categoryLabels[ann.category]?.fr : categoryLabels[ann.category]?.ar}
                      </span>
                    </div>

                    {/* Photos Gallery or Decorative Header */}
                    {allImages.length > 0 ? (
                      <div className="relative w-full">
                        <AnnouncementImageGallery images={allImages} title={ann.title} isRtl={isRtl} />
                      </div>
                    ) : null}

                    {/* Body Content */}
                    <div className="p-4 sm:p-5 space-y-2.5 text-start">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-[#1C3F3A] transition-colors line-clamp-2">
                        {ann.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {ann.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action & Real Views Count */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500 flex items-center gap-1 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-[#1C3F3A]" />
                      <span className="line-clamp-1">{ann.publisher}</span>
                    </span>

                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200" title="عدد المشاهدات الحقيقية">
                        <Eye className="w-3.5 h-3.5 text-[#B82B2B]" />
                        <span>{ann.views || 0}</span>
                      </span>

                      <span className="font-bold text-[#B82B2B] group-hover:text-[#961c1c] flex items-center gap-1">
                        <span>{isFr ? 'Voir' : 'قراءة'}</span>
                        {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      </span>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* ANNOUNCEMENT LIGHTBOX MODAL */}
      {selectedAnnouncement && (
        <div
          className="fixed inset-0 z-50 bg-[#0d1c19]/70 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative text-start flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-[#1C3F3A] hover:bg-[#142e2a] text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Poster Images Gallery in Modal */}
            {((selectedAnnouncement.imageUrls && selectedAnnouncement.imageUrls.length > 0) || selectedAnnouncement.imageUrl) && (
              <div className="bg-[#FAF7EE] flex-shrink-0">
                <AnnouncementImageGallery
                  images={selectedAnnouncement.imageUrls && selectedAnnouncement.imageUrls.length > 0 ? selectedAnnouncement.imageUrls : [selectedAnnouncement.imageUrl!]}
                  title={selectedAnnouncement.title}
                  isRtl={isRtl}
                  isModal={true}
                />
              </div>
            )}

            {/* Announcement Details (Scrollable if long) */}
            <div className="p-6 sm:p-8 space-y-4 bg-[#faf7ee] overflow-y-auto flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-[#1C3F3A] text-white font-bold border border-[#1C3F3A] flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-amber-300" />
                  {isFr
                    ? categoryLabels[selectedAnnouncement.category]?.fr
                    : categoryLabels[selectedAnnouncement.category]?.ar}
                </span>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-slate-700 text-xs font-mono font-bold bg-white px-3 py-1 rounded-full border border-slate-200">
                    <Eye className="w-3.5 h-3.5 text-[#B82B2B]" />
                    <span>{selectedAnnouncement.views || 0} {isFr ? 'vues' : 'مشاهدة'}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-700 text-xs font-bold bg-white px-3 py-1 rounded-full border border-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-[#B82B2B]" />
                    <span>{selectedAnnouncement.date}</span>
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedAnnouncement.title}
              </h3>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedAnnouncement.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span className="font-bold text-[#1C3F3A] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#B82B2B]" />
                  {selectedAnnouncement.publisher}
                </span>

                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-5 py-2 rounded-xl bg-[#1C3F3A] hover:bg-[#142e2a] text-white font-bold transition-colors shadow-sm"
                >
                  {isFr ? 'Fermer' : 'إغلاق الإعلان'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
