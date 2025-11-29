// @ts-ignore
import React, { useState, useEffect, useMemo } from 'react';
// @ts-ignore
import { Settings, Globe, Send, History, Moon, Sun, Info, ChevronDown, ChevronUp, Clock, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { LoanRecord, ChatMessage, LanguageCode, Theme, Currency } from '../types';
import { getSupportResponse } from '../services/geminiService';
import { translations, SUPPORTED_LANGUAGES } from '../utils/translations';
// @ts-ignore
import ReactMarkdown from 'react-markdown';

interface SettingsPanelProps {
  students: LoanRecord[];
  interestRate: number;
  loanTermYears: number;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  currencySymbol: string;
  currencyRate: number;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    students, 
    interestRate, 
    loanTermYears, 
    language, 
    setLanguage, 
    theme, 
    setTheme,
    currency,
    setCurrency,
    currencySymbol,
    currencyRate
}) => {
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'contact'>('profile');
  const [installDate, setInstallDate] = useState<number>(Date.now());
  const [showAbout, setShowAbout] = useState(false);
  
  const isDark = theme === 'dark';

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Chat greeting when first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: 'Hello! I am your AI assistant. How can I help you today?', timestamp: Date.now() }]);
    }
  }, []);

  // When language changes, add a new greeting in that language
  useEffect(() => {
    const greetings: Record<LanguageCode, string> = {
      'English': "How can I help you?",
      'Mandarin Chinese': "我能为您做些什么？",
      'Hindi': "मैं आपकी कैसे मदद कर सकता हूँ?",
      'Spanish': "¿En qué puedo ayudarte?",
      'Arabic': "كيف يمكنني مساعدتك؟",
      'French': "Comment puis-je vous aider ?",
      'Bengali': "আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
      'Portuguese': "Como posso ajudar você?",
      'Russian': "Чем могу помочь?",
      'Indonesian': "Apa yang bisa saya bantu?",
      'Azerbaijani': "Sizə necə kömək edə bilərəm?",
      'Turkish': "Size nasıl yardımcı olabilirim?"
    };

    if (messages.length > 0) {
        setMessages(prev => [...prev, { role: 'model', text: greetings[language] || "How can I help you?", timestamp: Date.now() }]);
    }
  }, [language]);

  // Initialize Install Date
  useEffect(() => {
    const storedDate = localStorage.getItem('eduFinanceInstallDate');
    if (storedDate) {
      setInstallDate(parseInt(storedDate, 10));
    } else {
      const now = Date.now();
      localStorage.setItem('eduFinanceInstallDate', now.toString());
      setInstallDate(now);
    }
  }, []);

  // Calculate Cumulative Stats using proper fields
  const stats = useMemo(() => {
    const daysSinceInstall = Math.max(1, Math.floor((Date.now() - installDate) / (1000 * 60 * 60 * 24)));
    
    // Calculate total daily values for current loan set
    let totalDailySalary = 0;
    let totalDailyLoanCost = 0;

    const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
      if (principal <= 0) return 0;
      if (annualRate <= 0) return principal / (years * 12);
      const monthlyRate = annualRate / 100 / 12;
      const numberOfPayments = years * 12;
      return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
             (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    };

    students.forEach(s => {
      totalDailySalary += s.monthlyIncome / 30;
      totalDailyLoanCost += calculateMonthlyPayment(s.amount, interestRate, loanTermYears) / 30;
    });

    return {
      daysSinceInstall,
      totalEarned: (totalDailySalary * daysSinceInstall) * currencyRate,
      totalLost: (totalDailyLoanCost * daysSinceInstall) * currencyRate
    };
  }, [students, installDate, interestRate, loanTermYears, currencyRate]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = { role: 'user', text: inputMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    const context = students.length > 0 
      ? `User Loans: ${students.length} active. Total Debt approx: ${students.reduce((acc,s)=>acc+s.amount,0)}. Income: ${students[0].monthlyIncome}.`
      : "User Profile: No data yet.";

    const responseText = await getSupportResponse(inputMessage, language, context);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setIsTyping(false);
  };

  // Styles
  const dropdownBg = isDark ? 'bg-[#1a1f2e] border-white/10' : 'bg-white border-slate-200';
  const headerBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-white/50' : 'text-slate-500';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white shadow-lg' : (isDark ? 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700')}`}
        title={t.settings}
      >
        <Settings size={20} className={isOpen ? 'animate-spin-slow' : ''} />
      </button>

      {/* Panel Dropdown */}
      {isOpen && (
        <>
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />
            
            <div className={`absolute right-0 top-12 w-[320px] md:w-[380px] z-50 border rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[85vh] md:max-h-[600px] ${dropdownBg}`}>
                {/* Header */}
                <div className={`p-4 border-b flex items-center justify-between ${headerBg}`}>
                    <h2 className={`${textMain} font-semibold flex items-center gap-2 text-sm`}>
                    <Settings size={16} /> {t.settings}
                    </h2>
                    <div className={`flex rounded-lg p-1 ${isDark ? 'bg-black/20' : 'bg-slate-200'}`}>
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`px-3 py-1 rounded text-[10px] font-medium transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white' : textMuted}`}
                    >
                        {t.profile}
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        className={`px-3 py-1 rounded text-[10px] font-medium transition-all ${activeTab === 'contact' ? 'bg-blue-600 text-white' : textMuted}`}
                    >
                        {t.contactUs}
                    </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    {activeTab === 'profile' ? (
                    <div className="p-6 space-y-6">
                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg relative">
                            ME
                            <div className={`absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 rounded-full ${isDark ? 'border-[#1a1f2e]' : 'border-white'}`}></div>
                        </div>
                        <div>
                            <h3 className={`${textMain} font-bold`}>My Account</h3>
                            <p className={`${textMuted} text-xs`}>EduEasy User</p>
                            <div className="flex items-center gap-1 mt-1 text-green-400 text-xs font-medium">
                            Active
                            </div>
                        </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3">
                            <h4 className={`${textMuted} text-xs font-bold uppercase tracking-wider`}>Usage History</h4>
                            
                            <div className={`${cardBg} rounded-xl p-4 border`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="text-blue-400" size={16} />
                                    <span className={`${isDark ? 'text-white/80' : 'text-slate-700'} text-sm`}>{t.activeSince}</span>
                                </div>
                                <div className={`${textMain} font-mono text-lg font-semibold ml-7`}>
                                    {new Date(installDate).toLocaleDateString()}
                                </div>
                                <div className={`${textMuted} text-xs ml-7`}>
                                    ({stats.daysSinceInstall} days)
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className={`bg-green-500/10 rounded-xl p-3 border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
                                    <div className="flex items-center gap-2 mb-1 text-green-600 text-xs font-medium">
                                        <TrendingUp size={14} /> {t.totalEarned}
                                    </div>
                                    <div className={`${textMain} font-mono font-bold`}>
                                        {currencySymbol}{stats.totalEarned.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </div>
                                </div>
                                <div className={`bg-red-500/10 rounded-xl p-3 border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
                                    <div className="flex items-center gap-2 mb-1 text-red-500 text-xs font-medium">
                                        <TrendingDown size={14} /> {t.totalLost}
                                    </div>
                                    <div className={`${textMain} font-mono font-bold`}>
                                        {currencySymbol}{stats.totalLost.toLocaleString(undefined, {maximumFractionDigits: 0})}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Currency Toggle */}
                        <div className="space-y-2">
                             <label className={`${textMuted} text-xs font-bold uppercase tracking-wider flex items-center gap-2`}>
                                <RefreshCw size={14} /> {t.currency}
                            </label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrency('USD')} 
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${currency === 'USD' ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700')}`}
                                >
                                    USD ($)
                                </button>
                                <button 
                                    onClick={() => setCurrency('AZN')} 
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${currency === 'AZN' ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700')}`}
                                >
                                    AZN (₼)
                                </button>
                            </div>
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <label className={`${textMuted} text-xs font-bold uppercase tracking-wider flex items-center gap-2`}>
                                <Globe size={14} /> {t.language}
                            </label>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                                className={`w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-colors ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'}`}
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                <option key={lang} value={lang} className={isDark ? "bg-slate-800" : "bg-white"}>{lang}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mode Toggle */}
                        <div className="space-y-3 pt-2 border-t border-dashed border-gray-500/20">
                            <label className={`${textMuted} text-xs font-bold uppercase tracking-wider flex items-center gap-2`}>
                                {isDark ? <Moon size={14} /> : <Sun size={14} />} {t.mode}
                            </label>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${!isDark ? 'text-blue-600' : textMuted}`}>{t.lightMode}</span>
                                
                                <button 
                                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDark ? 'bg-blue-600' : 'bg-slate-300'}`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                                
                                <span className={`text-sm font-medium ${isDark ? 'text-blue-400' : textMuted}`}>{t.darkMode}</span>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="pt-2 border-t border-dashed border-gray-500/20">
                            <button 
                                onClick={() => setShowAbout(!showAbout)}
                                className="w-full flex items-center justify-between group"
                            >
                                <label className={`${textMuted} text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer group-hover:text-blue-500`}>
                                    <Info size={14} /> {t.about}
                                </label>
                                {showAbout ? <ChevronUp size={14} className={textMuted}/> : <ChevronDown size={14} className={textMuted}/>}
                            </button>
                            
                            {showAbout && (
                                <div className={`mt-3 p-4 rounded-xl border text-sm leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar ${isDark ? 'bg-black/20 border-white/10 text-white/80' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                    <p className="font-light whitespace-pre-wrap">
                                        {t.aboutEduEasy}
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>
                    ) : (
                    <div className="flex flex-col h-[400px]">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : (isDark ? 'bg-white/10 text-white/90 border border-white/5' : 'bg-slate-100 text-slate-800 border border-slate-200')} rounded-bl-none`}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                            <div className={`rounded-2xl rounded-bl-none p-3 text-xs italic animate-pulse ${isDark ? 'bg-white/10 text-white/50' : 'bg-slate-100 text-slate-500'}`}>
                                {t.aiTyping}
                            </div>
                            </div>
                        )}
                        </div>
                        <div className={`p-3 border-t ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-2">
                            <input 
                            type="text" 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={t.askQuestion}
                            className={`flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 ${isDark ? 'bg-black/20 border-white/10 text-white placeholder-white/30' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'}`}
                            />
                            <button 
                            onClick={handleSendMessage}
                            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-500 transition-colors shadow-lg"
                            >
                            <Send size={16} />
                            </button>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
      )}
    </div>
  );
};