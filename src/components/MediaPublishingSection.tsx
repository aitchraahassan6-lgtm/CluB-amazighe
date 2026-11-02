import React, { useState, useRef } from 'react';
import { Announcement } from '../types/bureau';
import { Language } from './AmazighHeader';
import { Image, Upload, Calendar, Tag, Send, Trash2, Eye, CheckCircle2, Megaphone, Sparkles, Building2, PlusCircle, X } from 'lucide-react';

interface MediaPublishingSectionProps {
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  currentLang: Language;
}

export const MediaPublishingSection: React.FC<MediaPublishingSectionProps> = ({
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  currentLang,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'announcement' | 'event' | 'statement' | 'workshop'>('announcement');
  const [description, setDescription] = useState('');
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [publishToArchive, setPublishToArchive] = useState(true);
  const [publishToWebsite, setPublishToWebsite] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Handle multiple image uploads from Phone / PC
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const readPromises = files.map(
        (file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          })
      );

      Promise.all(readPromises).then((newImages) => {
        const totalImages = [...imagesPreview, ...newImages];
        if (totalImages.length > 20) {
          alert(isFr ? 'Vous ne pouvez pas ajouter plus de 20 images.' : 'لا يمكنك إضافة أكثر من 20 صورة في منشور واحد.');
          setImagesPreview(totalImages.slice(0, 20));
        } else {
          setImagesPreview(totalImages);
        }
        setPublishToArchive(true); // Automatically check publish to archive when image uploaded
      });
    }
  };

  const handleRemoveSingleImage = (indexToRemove: number) => {
    setImagesPreview((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllImages = () => {
    setImagesPreview([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Title and description are required ONLY if NOT publishing to archive
    if (!publishToArchive && (!title.trim() || !description.trim())) {
      return;
    }

    const finalTitle = title.trim() || (isFr ? 'Photo d\'Archive' : 'صورة أرشيفية للنادي');
    const finalDescription = description.trim() || (isFr ? 'Photo publiée dans le ruban d\'archive du club.' : 'صورة مضافة إلى شريط الأرشيف المصور للنادي.');

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: finalTitle,
      date,
      description: finalDescription,
      imageUrl: imagesPreview[0] || '',
      imageUrls: imagesPreview.length > 0 ? imagesPreview : [],
      publisher: 'نادي الثقافة الأمازيغية ببرشيد',
      category,
      createdAt: new Date().toISOString().split('T')[0],
      publishToArchive,
      publishToWebsite,
    };

    onAddAnnouncement(newAnn);
    setIsSuccess(true);
    setTitle('');
    setDescription('');
    handleClearAllImages();

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  const categoryLabels: Record<string, { ar: string; fr: string; tm: string }> = {
    announcement: { ar: 'إعلان عام', fr: 'Annonce Générale', tm: 'ⵜⵓⵙⵉⵔⵜ' },
    event: { ar: 'تظاهرة وندوة ثقافية', fr: 'Événement Culturel', tm: 'ⴰⵎⵓⵙⵙⵓ' },
    workshop: { ar: 'ورشة تكوينية (تيفيناغ)', fr: 'Atelier de Formation', tm: 'ⵜⴰⵙⵉⵍⴰ' },
    statement: { ar: 'بيان رسمي ومستجد', fr: 'Communiqué Officiel', tm: 'ⴰⵍⵖⵓ' },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Officer Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#1C3F3A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0 border border-white/20">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {isFr ? 'Bureau de la Communication & Publications' : 'مصلحة الإعلام والنشر والتواصل الرسمي'}
            </h3>
            <p className="text-xs text-emerald-100/80">
              {isFr
                ? 'Publiez des annonces et actualités au nom du club avec photos et dates'
                : 'نشر الإعلانات، المستجدات والتغطيات الرسمية باسم نادي الثقافة الأمازيغية ببرشيد'}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
          <Building2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Publié au nom du Club' : 'النشر معتمد باسم النادي'}</span>
        </div>
      </div>

      {/* Success Alert */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {isFr
              ? 'L\'annonce a été publiée avec succès au nom du Club !'
              : 'تم نشر الإعلان والمستجد بنجاح باسم نادي الثقافة الأمازيغية ببرشيد!'}
          </span>
        </div>
      )}

      {/* Form: Publish New Announcement */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
          <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#1C3F3A]" />
            <span>{isFr ? 'Créer et Publier une Nouvelle Annonce' : 'إعداد ونشر إعلان أو مستجد جديد'}</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            {isFr ? 'Visibilité publique immédiate' : 'يظهر في واجهة النادي'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isFr
                  ? `Titre ${!publishToArchive ? '(Obligatoire)' : '(Optionnel pour l\'archive)'}`
                  : `عنوان الإعلان ${!publishToArchive ? '(مطلوب/إجباري)' : '(اختياري عند نشر صورة أرشيفية)'}`}
              </label>
              <input
                type="text"
                required={!publishToArchive}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isFr ? 'Ex: Ouverture des ateliers Tifinagh 2026...' : 'مثال: انطلاق ورشات تعلم تيفيناغ بدار الشباب برشيد...'}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-medium"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isFr ? 'Date de l\'événement / النشر *' : 'تاريخ الإعلان أو الحدث *'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40 font-medium cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isFr ? 'Type de publication' : 'نوع الإعلان والتصنيف'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['announcement', 'event', 'workshop', 'statement'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center flex items-center justify-center gap-1.5 ${
                    category === cat
                      ? 'bg-[#1C3F3A] text-white border-[#1C3F3A] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{isFr ? categoryLabels[cat].fr : categoryLabels[cat].ar}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload from Phone / PC ("يمكن له اختيار الصور من الهاتف او الحاسوب") */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Image className="w-4 h-4 text-[#1C3F3A]" />
                <span>
                  {isFr
                    ? 'Photos / Affiches de l\'annonce (Sélection multiple possible)'
                    : 'صور أو ملصقات الإعلان (يمكن اختيار عدة صور في منشور واحد)'}
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {isFr ? 'Optionnel (JPG, PNG)' : 'اختياري (يمكن إضافة عدة صور)'}
              </span>
            </label>

            {imagesPreview.length > 0 ? (
              <div className="space-y-3">
                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imagesPreview.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-amber-200 bg-[#FAF7EE] aspect-[4/3] group shadow-xs"
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveSingleImage(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-md"
                        title="حذف هذه الصورة"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-[#1C3F3A]/90 text-amber-200 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        {idx + 1}
                      </div>
                    </div>
                  ))}

                  {/* Add More Photos Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#1C3F3A] bg-slate-50 hover:bg-slate-100 rounded-xl aspect-[4/3] flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center"
                  >
                    <PlusCircle className="w-5 h-5 text-[#1C3F3A] mb-1" />
                    <span className="text-[11px] font-bold text-slate-700">
                      {isFr ? 'Ajouter d\'autres photos' : 'إضافة صورة أخرى'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                  <span>
                    {isFr
                      ? `${imagesPreview.length} photo(s) sélectionnée(s)`
                      : `تم اختيار ${imagesPreview.length} صورة للمنشور`}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllImages}
                    className="text-rose-600 hover:underline text-[11px] font-bold"
                  >
                    {isFr ? 'Tout effacer' : 'حذف جميع الصور'}
                  </button>
                </div>

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#1C3F3A] bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 text-slate-500 group-hover:text-[#1C3F3A] flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  {isFr ? 'Cliquez pour choisir une ou plusieurs photos' : 'اضغط لاختيار صورة أو عدة صور من هاتفك/حاسوبك'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isFr ? 'Vous pouvez sélectionner plusieurs photos à la fois' : 'يمكنك تحديد أكثر من صورة في وقت واحد لنشرها كألبوم'}
                </p>
              </div>
            )}
          </div>

          {/* PUBLISHING DESTINATIONS (خيارات ومكان النشر: زر النشر في الأرشيف ونشر الإعلان في الموقع) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#1C3F3A]" />
              <span>{isFr ? 'Destination de la publication' : 'خيارات ومكان النشر المعتمد *'}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: النشر في شريط الأرشيف المصور */}
              <button
                type="button"
                onClick={() => setPublishToArchive(!publishToArchive)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  publishToArchive
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Image className={`w-4 h-4 ${publishToArchive ? 'text-[#B82B2B]' : 'text-slate-400'}`} />
                  <span>{isFr ? 'Publier dans le Ruban d\'Archive' : 'زر النشر في شريط الأرشيف المصور'}</span>
                </span>
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                  publishToArchive ? 'bg-[#B82B2B] text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {publishToArchive ? '✓' : ''}
                </span>
              </button>

              {/* Option 2: النشر في قسم الإعلانات والمنشورات أسفل الصفحة الرئيسية */}
              <button
                type="button"
                onClick={() => setPublishToWebsite(!publishToWebsite)}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                  publishToWebsite
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Megaphone className={`w-4 h-4 ${publishToWebsite ? 'text-[#1C3F3A]' : 'text-slate-400'}`} />
                  <span>{isFr ? 'Publier dans les Annonces (المنشورات أسفل الموقع)' : 'نشر إعلان / منشور أسفل الموقع'}</span>
                </span>
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                  publishToWebsite ? 'bg-[#1C3F3A] text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {publishToWebsite ? '✓' : ''}
                </span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isFr
                ? `Texte et Détails ${!publishToArchive ? '(Obligatoire)' : '(Optionnel pour l\'archive)'}`
                : `نص وتفاصيل الإعلان ${!publishToArchive ? '(مطلوب/إجباري)' : '(اختياري عند النشر في الأرشيف)'}`}
            </label>
            <textarea
              required={!publishToArchive}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isFr
                  ? (!publishToArchive ? 'Rédigez le texte complet de l\'annonce (Obligatoire)...' : 'Rédigez le texte complet (optionnel pour l\'archive)...')
                  : (!publishToArchive ? 'اكتب تفاصيل ونص الإعلان (مطلوب)...' : 'اكتب نص الإعلان (اختياري عند اختيار نشر صورة أرشيفية)...')
              }
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1C3F3A] bg-slate-50/40"
            ></textarea>
          </div>

          {/* Publication Authority Signature Note */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold">
              <Building2 className="w-4 h-4 text-amber-800 shrink-0" />
              <span>{isFr ? 'Signature:' : 'توقيع النشر:'} نادي الثقافة الأمازيغية ببرشيد</span>
            </span>
            <span className="text-slate-500">{date}</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#1C3F3A] hover:bg-[#142e2a] text-white text-xs sm:text-sm font-bold py-3.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isFr ? 'Publier l\'annonce maintenant' : 'نشر الإعلان فوراً باسم النادي'}</span>
          </button>

        </form>
      </div>

      {/* List of Published Announcements */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100">
          <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#B82B2B]" />
            <span>{isFr ? 'Historique des Publications' : 'سجل الإعلانات والمستجدات المنشورة'} ({announcements.length})</span>
          </h4>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            {isFr ? 'Aucune annonce publiée pour le moment.' : 'لا توجد إعلانات منشورة حالياً.'}
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start"
              >
                {/* Photo Thumbnail if present */}
                {ann.imageUrl && (
                  <div className="w-full md:w-44 aspect-video rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                    <img src={ann.imageUrl} alt={ann.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {isFr ? categoryLabels[ann.category]?.fr : categoryLabels[ann.category]?.ar}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ann.date}</span>
                    </span>
                  </div>

                  <h5 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {ann.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-3">
                    {ann.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{ann.publisher}</span>
                    <span>·</span>
                    <span>{ann.createdAt}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                  title={isFr ? 'Supprimer l\'annonce' : 'حذف الإعلان'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
