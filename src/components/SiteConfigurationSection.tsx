import React, { useState } from 'react';
import { SiteSettings, saveSiteSettingsToFirebase } from '../lib/firebase';
import { Language } from './AmazighHeader';
import { 
  Settings, 
  Save, 
  Globe, 
  Phone, 
  Facebook, 
  Instagram, 
  ImageIcon, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SiteConfigurationSectionProps {
  settings: SiteSettings;
  currentLang: Language;
}

export const SiteConfigurationSection: React.FC<SiteConfigurationSectionProps> = ({
  settings,
  currentLang,
}) => {
  const isFr = currentLang === 'fr';
  const [localSettings, setLocalSettings] = useState<SiteSettings>(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await saveSiteSettingsToFirebase(localSettings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-start">
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">
              {isFr ? 'Configuration du Club' : 'إعدادات هوية النادي'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isFr 
                ? 'Gérez les noms, logos, tampons et contacts affichés sur les reçus et le site.' 
                : 'تخصيص أسماء النادي، الشعارات، الختم ومعلومات التواصل التي تظهر في الوصل والموقع.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Info */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>{isFr ? 'Informations Générales' : 'المعلومات العامة والهوية'}</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Nom du Club (Arabe) *' : 'اسم النادي (بالعربية) *'}
              </label>
              <input
                type="text"
                required
                value={localSettings.clubNameAr}
                onChange={(e) => setLocalSettings({...localSettings, clubNameAr: e.target.value})}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Nom du Club (Français) *' : 'اسم النادي (بالفرنسية) *'}
              </label>
              <input
                type="text"
                required
                value={localSettings.clubNameFr}
                onChange={(e) => setLocalSettings({...localSettings, clubNameFr: e.target.value})}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visual Assets (Logos & Stamp) */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>{isFr ? 'Logos & Cachet' : 'الشعارات والختم الرسمي'}</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'URL Logo du Club' : 'رابط شعار النادي (URL)'}
              </label>
              <input
                type="url"
                value={localSettings.clubLogoUrl}
                onChange={(e) => setLocalSettings({...localSettings, clubLogoUrl: e.target.value})}
                placeholder="https://..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'URL Logo de l\'Etablissement' : 'رابط شعار المؤسسة (URL)'}
              </label>
              <input
                type="url"
                value={localSettings.schoolLogoUrl}
                onChange={(e) => setLocalSettings({...localSettings, schoolLogoUrl: e.target.value})}
                placeholder="https://..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'URL du Cachet (Tampon)' : 'رابط الختم الرسمي (URL)'}
              </label>
              <input
                type="url"
                value={localSettings.stampUrl}
                onChange={(e) => setLocalSettings({...localSettings, stampUrl: e.target.value})}
                placeholder="https://..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>{isFr ? 'Contact & Social' : 'التواصل والشبكات الاجتماعية'}</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Numéro WhatsApp' : 'رقم الواتساب'}
              </label>
              <input
                type="text"
                value={localSettings.whatsappNumber}
                onChange={(e) => setLocalSettings({...localSettings, whatsappNumber: e.target.value})}
                placeholder="2126..."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Facebook URL' : 'رابط فيسبوك'}
              </label>
              <input
                type="url"
                value={localSettings.facebookUrl}
                onChange={(e) => setLocalSettings({...localSettings, facebookUrl: e.target.value})}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {isFr ? 'Instagram URL' : 'رابط إنستغرام'}
              </label>
              <input
                type="url"
                value={localSettings.instagramUrl}
                onChange={(e) => setLocalSettings({...localSettings, instagramUrl: e.target.value})}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1C3F3A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Action */}
        <div className="md:col-span-2 flex flex-col items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className="w-full max-w-xs bg-[#1C3F3A] hover:bg-[#142e2a] text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isFr ? 'Enregistrer les Paramètres' : 'حفظ جميع الإعدادات'}</span>
          </button>

          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFr ? 'Paramètres sauvegardés avec succès !' : 'تم حفظ الإعدادات بنجاح في قاعدة البيانات!'}</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{isFr ? 'Erreur lors de la sauvegarde.' : 'حدث خطأ أثناء محاولة الحفظ.'}</span>
            </div>
          )}
        </div>
      </form>
      
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
        <p className="font-bold mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          {isFr ? 'Note Importante' : 'ملاحظة هامة'}
        </p>
        {isFr 
          ? 'Ces informations sont utilisées pour générer dynamiquement les reçus d\'adhésion (PNG & Excel). Assurez-vous d\'utiliser des liens d\'images valides et accessibles publiquement.' 
          : 'هذه المعلومات تُستخدم لتوليد وصولات الانخراط بشكل ديناميكي (صور وإكسل). تأكد من استخدام روابط صور صحيحة ومتاحة للعموم ليتم عرضها بشكل صحيح في الوصولات.'}
      </div>
    </div>
  );
};
