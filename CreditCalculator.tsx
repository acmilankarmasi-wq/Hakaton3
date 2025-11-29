
// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { X, Calculator } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../utils/translations';

interface CreditCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const CreditCalculator: React.FC<CreditCalculatorProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];
  const [amount, setAmount] = useState(1000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(5);

  if (!isOpen) return null;

  const calculatePayment = () => {
    const r = rate / 100 / 12;
    const n = months;
    if (r === 0) return amount / n;
    return (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const monthly = calculatePayment();
  const total = monthly * months;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-slate-800">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Calculator size={18} className="text-blue-600"/> {t.calculatorTitle}
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">{t.amount}</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">{t.loanTerm} (Months)</label>
            <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">{t.interestRate}</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full p-2 border rounded mt-1" />
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-xl space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">{t.monthlyPayment}</span>
              <span className="font-bold text-blue-600">{monthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-100 pt-2">
              <span className="text-sm text-slate-600">{t.totalInterest}</span>
              <span className="font-bold text-slate-800">{(total - amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
