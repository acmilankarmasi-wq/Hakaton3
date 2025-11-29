// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { X, Lock, Shield, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../utils/translations';

interface CardEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  language: LanguageCode;
  isDark: boolean;
  title: string;
  submitLabel: string;
}

export const CardEntryModal: React.FC<CardEntryModalProps> = ({
  isOpen, onClose, onSubmit, language, isDark, title, submitLabel
}) => {
  const t = translations[language];
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [cardData, setCardData] = useState({ number: '', holder: '', expiry: '', cvv: '' });

  if (!isOpen) return null;

  const bgClass = isDark ? 'bg-[#1a1f2e] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800';
  const inputClass = isDark ? 'bg-black/20 border-white/10 text-white placeholder-white/30' : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${bgClass}`}>
        <div className="p-6 border-b border-dashed border-gray-500/30 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CreditCard size={20} className="text-blue-500" /> {title}
          </h3>
          <button onClick={onClose}><X size={20} className="opacity-50 hover:opacity-100" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-70">{t.cardNumber}</label>
            <input
              value={cardData.number}
              onChange={e => setCardData({...cardData, number: e.target.value})}
              placeholder="0000 0000 0000 0000"
              className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none font-mono ${inputClass}`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase opacity-70">{t.cardHolder}</label>
            <input
              value={cardData.holder}
              onChange={e => setCardData({...cardData, holder: e.target.value})}
              placeholder="NAME SURNAME"
              className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none ${inputClass}`}
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold uppercase opacity-70">{t.expiryDate}</label>
              <input
                value={cardData.expiry}
                onChange={e => setCardData({...cardData, expiry: e.target.value})}
                placeholder="MM/YY"
                className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none font-mono ${inputClass}`}
              />
            </div>
            <div className="space-y-1 w-24">
              <label className="text-xs font-bold uppercase opacity-70">{t.cvv}</label>
              <input
                value={cardData.cvv}
                onChange={e => setCardData({...cardData, cvv: e.target.value})}
                placeholder="123"
                className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none font-mono ${inputClass}`}
              />
            </div>
          </div>

          <button
            onClick={onSubmit}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-all mt-4"
          >
            {submitLabel}
          </button>

          {/* Privacy Notice */}
          <div className="pt-4 border-t border-dashed border-gray-500/20">
            <button
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-medium w-full justify-center"
            >
              <Lock size={14} /> {t.privacyNoticeLink} {showPrivacy ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showPrivacy && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs leading-relaxed text-blue-400">
                <p className="flex gap-2">
                  <Shield size={16} className="shrink-0" />
                  {t.privacyNoticeContent}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEntryModal;
