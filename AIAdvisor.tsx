// @ts-ignore
import React, { useState } from 'react';
import { Student, LanguageCode } from '../types';
import { analyzeFinancialHealth } from '../services/geminiService';
import { translations } from '../utils/translations';
// @ts-ignore
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  students: Student[];
  language: LanguageCode;
  isDark?: boolean;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ students, language, isDark = true }) => {
  const t = translations[language];
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (students.length === 0) {
      setAnalysis(t.noRecords);
      return;
    }
    setLoading(true);
    const result = await analyzeFinancialHealth(students, language);
    setAnalysis(result);
    setLoading(false);
  };

  // Styles
  const containerClass = isDark
    ? "bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-md border-white/20 text-white shadow-2xl"
    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl";

  const outputClass = isDark
    ? "bg-black/30 border-white/10 text-white"
    : "bg-white border-slate-200 text-slate-800 shadow-inner";

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-8 border ${containerClass}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3 text-white">
              <Sparkles className="text-yellow-300" />
              {t.analyzeTitle}
            </h2>
            <p className="text-white/80 max-w-xl">
              {t.analyzeDesc}
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`
              px-6 py-3 rounded-full font-semibold text-white shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95
              ${loading ? 'bg-white/20 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30 border border-white/40'}
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            {loading ? t.analyzing : t.generateAnalysis}
          </button>
        </div>

        {/* Output Area */}
        <div className={`rounded-xl p-6 min-h-[200px] border ${outputClass}`}>
          {analysis ? (
             <div className={`prose max-w-none ${isDark ? 'prose-invert prose-p:text-white/90 prose-li:text-white/80 prose-headings:text-blue-300' : 'prose-headings:text-blue-800 prose-p:text-slate-700'}`}>
               <ReactMarkdown>{analysis}</ReactMarkdown>
             </div>
          ) : (
            <div className={`h-full flex flex-col items-center justify-center italic space-y-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              <Sparkles size={48} />
              <p>{t.analyzeDesc}</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`text-center text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
        <p>{t.disclaimer}</p>
      </div>
    </div>
  );
};
