// @ts-ignore
import React from 'react';
import { Student, LanguageCode } from '../types';
import { translations } from '../utils/translations';
// @ts-ignore
import { Calculator, ArrowRight, Wallet, Percent, Clock } from 'lucide-react';

interface DailyAnalysisProps {
  students: Student[];
  interestRate: number;
  setInterestRate: (rate: number) => void;
  loanTermYears: number;
  setLoanTermYears: (years: number) => void;
  language: LanguageCode;
  isDark?: boolean;
  currencySymbol: string;
  currencyRate: number;
}

export const DailyAnalysis: React.FC<DailyAnalysisProps> = ({ 
  students,
  interestRate,
  setInterestRate,
  loanTermYears,
  setLoanTermYears,
  language,
  isDark = true,
  currencySymbol,
  currencyRate
}) => {
  const t = translations[language];
  
  // Helper to calculate monthly loan payment (Amortization Formula)
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
    if (principal <= 0) return 0;
    if (annualRate <= 0) return principal / (years * 12);
    
    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  };

  // Styles
  const cardClass = isDark ? "bg-white/10 backdrop-blur-md border-white/20 shadow-lg text-white" : "bg-white border-slate-200 shadow-sm text-slate-800";
  const subCardClass = isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:border-blue-300 shadow-sm";
  const inputClass = isDark ? "bg-white/10 border-white/20 text-white" : "bg-slate-100 border-slate-300 text-slate-800";
  const textMuted = isDark ? "text-white/60" : "text-slate-500";
  const textSub = isDark ? "text-white/50" : "text-slate-400";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Configuration Panel */}
      <div className={`rounded-2xl p-6 border ${cardClass}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Calculator className="text-blue-400" />
              {t.dailySimulator}
            </h2>
            <p className={`${textMuted} text-sm mt-1`}>
              {t.dailyDesc}
            </p>
          </div>

          <div className={`flex flex-wrap gap-4 p-4 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <div className="space-y-1">
              <label className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                <Percent size={12} /> {t.interestRate}
              </label>
              <input 
                type="number" 
                min="0" 
                max="20" 
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={`${inputClass} border rounded-lg px-3 py-1.5 w-32 focus:outline-none focus:border-blue-400`}
              />
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                <Clock size={12} /> {t.loanTerm}
              </label>
              <input 
                type="number" 
                min="1" 
                max="30" 
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className={`${inputClass} border rounded-lg px-3 py-1.5 w-32 focus:outline-none focus:border-blue-400`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => {
          // Use currency rate for display calculations
          const principal = student.amount * currencyRate;
          const monthlyLoanPayment = calculateMonthlyPayment(principal, interestRate, loanTermYears);
          
          // Daily Calculations (assuming 30 days/month for simplicity)
          const dailyIncome = (student.monthlyIncome * currencyRate) / 30;
          const dailyLoss = monthlyLoanPayment / 30;
          const dailyRemaining = dailyIncome - dailyLoss;
          
          const percentRemaining = (dailyRemaining / dailyIncome) * 100;
          const isDanger = percentRemaining < 30;

          return (
            <div key={student.id} className={`group rounded-2xl p-6 border transition-all relative overflow-hidden ${subCardClass}`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{student.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'text-white/50 bg-white/10' : 'text-slate-500 bg-slate-100'}`}>{student.category}</span>
                </div>
                {isDanger && (
                  <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded border border-red-500/20">
                    {t.highDebt}
                  </span>
                )}
              </div>

              {/* Visualization Bar */}
              <div className={`w-full h-3 rounded-full mb-6 relative overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full absolute left-0 top-0 rounded-full transition-all duration-500 ${isDanger ? 'bg-red-400' : 'bg-green-400'}`}
                  style={{ width: `${Math.max(0, percentRemaining)}%` }}
                />
              </div>

              {/* Stats Grid */}
              <div className="space-y-3 relative z-10">
                {/* Income */}
                <div className="flex justify-between items-center text-sm">
                  <span className={`${textMuted} flex items-center gap-2`}>
                    <Wallet size={14} /> {t.dailyIncome}
                  </span>
                  <span className="font-mono text-green-500 font-medium">
                    +{currencySymbol}{dailyIncome.toFixed(2)}
                  </span>
                </div>

                {/* Loss */}
                <div className="flex justify-between items-center text-sm">
                  <span className={`${textMuted} flex items-center gap-2`}>
                    <ArrowRight size={14} className="rotate-45 text-red-400" /> {t.dailyCost}
                  </span>
                  <span className="font-mono text-red-400 font-medium">
                    -{currencySymbol}{dailyLoss.toFixed(2)}
                  </span>
                </div>

                <div className={`h-px my-2 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}></div>

                {/* Remaining */}
                <div className={`flex justify-between items-center p-3 rounded-lg border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                  <span className={`${isDark ? 'text-white/90' : 'text-slate-700'} font-medium text-sm`}>
                    {t.willRemain}
                    <span className={`block text-[10px] font-normal ${textSub}`}>{t.exclEssentials}</span>
                  </span>
                  <span className={`font-mono text-xl font-bold ${dailyRemaining < 0 ? 'text-red-500' : (isDark ? 'text-blue-300' : 'text-blue-600')}`}>
                    {currencySymbol}{dailyRemaining.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none transition-all"></div>
            </div>
          );
        })}

        {students.length === 0 && (
          <div className={`col-span-full flex flex-col items-center justify-center py-12 border border-dashed rounded-2xl ${isDark ? 'text-white/40 bg-white/5 border-white/10' : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
            <Calculator size={48} className="mb-4 opacity-50" />
            <p>{t.noRecords}</p>
          </div>
        )}
      </div>
    </div>
  );
};