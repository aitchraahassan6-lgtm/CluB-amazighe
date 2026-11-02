import React from 'react';
import { ImageOff } from 'lucide-react';
import { Language } from './AmazighHeader';
import { Announcement } from '../types/bureau';

interface ArchivePhotoItem {
  id: string;
  image: string;
  title: string;
  date: string;
}

interface ArchivePhotoReelProps {
  currentLang: Language;
  announcements?: Announcement[];
}

export const ArchivePhotoReel: React.FC<ArchivePhotoReelProps> = ({ currentLang, announcements = [] }) => {
  const isFr = currentLang === 'fr';
  const isTm = currentLang === 'tm';

  // Gather all photos explicitly published to the Archive by the Media Officer / Admin
  const publisherPhotos: ArchivePhotoItem[] = [];

  announcements
    .filter((ann) => ann.publishToArchive === true)
    .forEach((ann) => {
      const imgs = ann.imageUrls && ann.imageUrls.length > 0 ? ann.imageUrls : (ann.imageUrl ? [ann.imageUrl] : []);
      imgs.forEach((imgUrl, idx) => {
        if (imgUrl && imgUrl.trim().length > 0) {
          publisherPhotos.push({
            id: `${ann.id}-img-${idx}`,
            image: imgUrl,
            title: ann.title,
            date: ann.date,
          });
        }
      });
    });

  // Duplicate items for seamless infinite scrolling loop if photos exist
  const hasPhotos = publisherPhotos.length > 0;
  const repeatedPhotos = hasPhotos
    ? [...publisherPhotos, ...publisherPhotos, ...publisherPhotos, ...publisherPhotos]
    : [];

  return (
    <section aria-label="Archive Photo Reel" className="w-full bg-[#f8f5ee] relative overflow-hidden border-b border-[#e5dec9]">
      
      {/* Continuous Moving Slogan Ticker Bar */}
      <div
        style={{ backgroundColor: '#fff673', color: '#371e1e' }}
        className="w-full py-2.5 overflow-hidden border-b border-amber-900/15 relative flex items-center shadow-inner"
      >
        <div className="animate-slogan-ticker flex items-center gap-10 whitespace-nowrap text-xs sm:text-sm font-extrabold tracking-wide text-[#050402]">
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className="flex items-center gap-4">
              <span>
                {isFr
                  ? 'جميعاً من أجل ثقافة أمازيغية عالمة · TOUS POUR UNE CULTURE AMAZIGHE SAVANTE'
                  : (isTm ? 'جميعاً من أجل ثقافة أمازيغية عالمة · ⵎⴰⵕⵕⴰ ⵅⴼ ⵜⵓⵙⵙⵏⴰ ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵎⴰⴹⵍⴰⵏⵜ' : 'جميعاً من أجل ثقافة أمازيغية عالمة · نادي الثقافة الأمازيغية ببرشيد')}
              </span>
              <span className="text-[#B82B2B] font-bold">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* REEL CONTAINER */}
      <div
        style={{ backgroundColor: '#ffffff' }}
        className="relative w-full py-4 overflow-hidden"
      >
        {hasPhotos ? (
          /* Moving Archive Ribbon for Published Photos */
          <div className="animate-archive-reel flex items-center gap-0 px-0">
            {repeatedPhotos.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group relative flex-shrink-0 w-56 sm:w-76 h-28 sm:h-36 overflow-hidden border-r border-[#e5dec9] bg-[#f0ecdc] transition-all duration-300 hover:z-10 hover:shadow-xl"
                title={item.title}
              >
                {/* Edge-to-Edge Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no photos published by media officer yet */
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center bg-[#fdfbf7] border border-dashed border-amber-300/80 rounded-2xl max-w-2xl mx-auto my-2 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-2.5 shadow-sm">
              <ImageOff className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-1">
              {isFr ? 'Aucune photo publiée pour le moment' : 'أرشيف الصور يتجدد باستمرار'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              {isFr
                ? 'Les photos des activités s\'afficheront ici dès leur publication par التوثيق والإعلام.'
                : 'سيتم عرض الصور في هذا الشريط فور نشرها وتفعيل خيار الأرشيف من طرف مسؤول التوثيق والإعلام بالنادي.'}
            </p>
          </div>
        )}

      </div>

    </section>
  );
};
