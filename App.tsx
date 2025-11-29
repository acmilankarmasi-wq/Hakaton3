
// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { ViewState, LoanRecord, LanguageCode, Expense, SavingsGoal, Badge, Notification, Theme, Currency } from './types';
import { Dashboard } from './Components/Dashboard';
import { StudentList } from './Components/StudentList';
import { AIAdvisor } from './Components/AIAdvisor';
import { DailyAnalysis } from './Components/DailyAnalysis';
import { SettingsPanel } from './Components/SettingsPanel';
import { LoginScreen } from './Components/LoginScreen';
import { BudgetPlanner } from './Components/BudgetPlanner';
import { translations } from './utils/translations';
import { generateId } from './utils/helpers';
// @ts-ignore
import { LayoutDashboard, WalletCards, Sparkles, GraduationCap, Calculator, Target, Bell } from 'lucide-react';

// Single User Loan Data (Refactored from "Student" to "LoanRecord")
const INITIAL_LOANS: LoanRecord[] = [
  { id: '1', title: 'Fall Semester Tuition 2024', category: 'Education', monthlyIncome: 800, amount: 2500 },
  { id: '2', title: 'Laptop & Equipment', category: 'Supplies', monthlyIncome: 800, amount: 1500 },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Renamed state to 'loans' to reflect single user logic
  const [loans, setLoans] = useState<LoanRecord[]>(INITIAL_LOANS);
  
  // New Feature States
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  
  // Theme State
  const [theme, setTheme] = useState<Theme>('dark');
  const isDark = theme === 'dark';

  // Currency State (New)
  const [currency, setCurrency] = useState<Currency>('USD');
  const currencyRate = currency === 'AZN' ? 1.70 : 1;
  const currencySymbol = currency === 'AZN' ? '₼' : '$';

  // Initial notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: '1', 
      title: 'Welcome!', 
      message: 'Start tracking your loans today.', 
      translationKeyTitle: 'welcomeTitle',
      translationKeyMessage: 'welcomeMsg',
      type: 'info', 
      read: false, 
      time: 'Now' 
    },
    { 
      id: '2', 
      title: 'Tip', 
      message: 'Check the Daily Simulator to save money.',
      translationKeyTitle: 'tipTitle',
      translationKeyMessage: 'tipMsg', 
      type: 'success', 
      read: false, 
      time: '1h ago' 
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Language State
  const [language, setLanguage] = useState<LanguageCode>('English');
  const t = translations[language];

  // Global Simulation State
  const [interestRate, setInterestRate] = useState<number>(5.5); 
  const [loanTermYears, setLoanTermYears] = useState<number>(10);

  const handleAddLoan = (newLoan: LoanRecord) => setLoans([...loans, newLoan]);
  const handleUpdateLoan = (updatedLoan: LoanRecord) => setLoans(loans.map(s => s.id === updatedLoan.id ? updatedLoan : s));
  const handleDeleteLoan = (id: string) => setLoans(loans.filter(s => s.id !== id));
  
  const handleEarnBadge = (badge: Badge) => {
    setBadges([...badges, badge]);
    setNotifications(prev => [{
        id: generateId(),
        title: 'New Badge Unlocked!',
        message: `You earned the ${badge.name} badge!`,
        translationKeyTitle: 'badgeUnlocked',
        translationKeyMessage: 'badgeEarned',
        translationParams: { badgeName: badge.name },
        type: 'success',
        read: false,
        time: 'Just now'
    }, ...prev]);
  };

  const isRTL = language === 'Arabic';

  const getTranslatedText = (notification: Notification, type: 'title' | 'message'): string => {
    const key = type === 'title' ? notification.translationKeyTitle : notification.translationKeyMessage;
    const fallback = type === 'title' ? notification.title : notification.message;
    
    if (key && t[key]) {
      let text = t[key];
      if (notification.translationParams) {
        Object.keys(notification.translationParams).forEach((param) => {
          text = text.replace(`{${param}}`, notification.translationParams[param]);
        });
      }
      return text;
    }
    return fallback;
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={() => setIsAuthenticated(true)}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  const navBtnBase = `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 border`;
  const navBtnActive = isDark 
    ? "bg-white border-white scale-105 ring-2 ring-white/50 text-black" 
    : "bg-blue-600 border-blue-600 scale-105 ring-2 ring-blue-600/50 text-white";
    
  const navBtnInactive = isDark
    ? "bg-white/90 border-transparent hover:bg-white text-black/80"
    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600";

  return (
    <div 
      className={`relative min-h-screen overflow-x-hidden font-sans pb-24 md:pb-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-[#240b36] to-[#1a0b2e] text-white' : 'bg-slate-50 text-slate-900'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeIn">
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <GraduationCap size={24} className="text-white md:w-8 md:h-8" />
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.appTitle}</h1>
                <p className={`text-xs md:text-sm hidden md:block ${isDark ? 'text-blue-200' : 'text-slate-500'}`}>{t.appSubtitle}</p>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
                <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 relative rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                    <Bell size={20} />
                    {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#1a1f2e]"></span>}
                </button>
                {showNotifications && (
                        <div className={`absolute right-0 top-12 w-72 border rounded-xl shadow-2xl overflow-hidden z-50 ${isDark ? 'bg-[#1a1f2e] border-white/20' : 'bg-white border-slate-200'}`}>
                            <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                                <span className="font-bold text-sm">{t.notifications}</span>
                                <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-xs text-blue-400 hover:text-blue-300">{t.markAllRead}</button>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className={`p-4 text-center text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{t.noNotifications}</div>
                                ) : (
                                    notifications.map(n => (
                                        <div key={n.id} className={`p-3 border-b hover:bg-opacity-50 transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'} ${!n.read ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {getTranslatedText(n, 'title')}
                                                </span>
                                                <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{n.time}</span>
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                                            {getTranslatedText(n, 'message')}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <SettingsPanel 
                  students={loans}
                  interestRate={interestRate}
                  loanTermYears={loanTermYears}
                  language={language}
                  setLanguage={setLanguage}
                  theme={theme}
                  setTheme={setTheme}
                  currency={currency}
                  setCurrency={setCurrency}
                  currencySymbol={currencySymbol}
                  currencyRate={currencyRate}
                />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 relative rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                    <Bell size={20} />
                    {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-[#1a1f2e]"></span>}
                </button>
                
                {showNotifications && (
                    <div className={`absolute right-0 top-12 w-80 border rounded-xl shadow-2xl overflow-hidden z-50 ${isDark ? 'bg-[#1a1f2e] border-white/20' : 'bg-white border-slate-200'}`}>
                        <div className={`p-3 border-b flex justify-between items-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                            <span className="font-bold text-sm">{t.notifications}</span>
                            <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-xs text-blue-400 hover:text-blue-300">{t.markAllRead}</button>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className={`p-4 text-center text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{t.noNotifications}</div>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-3 border-b hover:bg-opacity-50 transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'} ${!n.read ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50') : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                              {getTranslatedText(n, 'title')}
                                            </span>
                                            <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{n.time}</span>
                                        </div>
                                        <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                                          {getTranslatedText(n, 'message')}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
              </div>

              <SettingsPanel 
                students={loans}
                interestRate={interestRate}
                loanTermYears={loanTermYears}
                language={language}
                setLanguage={setLanguage}
                theme={theme}
                setTheme={setTheme}
                currency={currency}
                setCurrency={setCurrency}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
              />

              <nav className={`flex items-center gap-3 p-2 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                <button 
                  onClick={() => setView(ViewState.DASHBOARD)} 
                  className={`${view === ViewState.DASHBOARD ? navBtnActive : navBtnInactive} ${navBtnBase}`}
                >
                  <LayoutDashboard size={18} className="text-sky-600" /> 
                  <span>{t.dashboard}</span>
                </button>
                
                <button 
                  onClick={() => setView(ViewState.MANAGE)} 
                  className={`${view === ViewState.MANAGE ? navBtnActive : navBtnInactive} ${navBtnBase}`}
                >
                  <WalletCards size={18} className="text-emerald-600" /> 
                  <span>{t.loans}</span>
                </button>
                
                <button 
                  onClick={() => setView(ViewState.BUDGET)} 
                  className={`${view === ViewState.BUDGET ? navBtnActive : navBtnInactive} ${navBtnBase}`}
                >
                  <Target size={18} className="text-orange-500" /> 
                  <span>{t.budget}</span>
                </button>
                
                <button 
                  onClick={() => setView(ViewState.DAILY)} 
                  className={`${view === ViewState.DAILY ? navBtnActive : navBtnInactive} ${navBtnBase}`}
                >
                  <Calculator size={18} className="text-purple-600" /> 
                  <span>{t.dailyAnalysis}</span>
                </button>
                
                <button 
                  onClick={() => setView(ViewState.INSIGHTS)} 
                  className={`${view === ViewState.INSIGHTS ? navBtnActive : navBtnInactive} ${navBtnBase}`}
                >
                  <Sparkles size={18} className="text-blue-900" /> 
                  <span>{t.aiAdvisor}</span>
                </button>
              </nav>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] safe-area-bottom ${isDark ? 'bg-white' : 'bg-white border-t border-slate-200'}`}>
          <div className="flex justify-around items-center p-3">
            <button 
              onClick={() => setView(ViewState.DASHBOARD)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${view === ViewState.DASHBOARD ? 'bg-slate-100' : ''}`}
            >
              <LayoutDashboard size={22} className="text-sky-600" />
              <span className="text-[10px] font-bold text-black">{t.dashboard}</span>
            </button>
            <button 
              onClick={() => setView(ViewState.MANAGE)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${view === ViewState.MANAGE ? 'bg-slate-100' : ''}`}
            >
              <WalletCards size={22} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-black">{t.loans}</span>
            </button>
            <button 
              onClick={() => setView(ViewState.BUDGET)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${view === ViewState.BUDGET ? 'bg-slate-100' : ''}`}
            >
              <Target size={22} className="text-orange-500" />
              <span className="text-[10px] font-bold text-black">{t.budget}</span>
            </button>
            <button 
              onClick={() => setView(ViewState.DAILY)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${view === ViewState.DAILY ? 'bg-slate-100' : ''}`}
            >
              <Calculator size={22} className="text-purple-600" />
              <span className="text-[10px] font-bold text-black">{t.dailyAnalysis}</span>
            </button>
            <button 
              onClick={() => setView(ViewState.INSIGHTS)} 
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${view === ViewState.INSIGHTS ? 'bg-slate-100' : ''}`}
            >
              <Sparkles size={22} className="text-blue-900" />
              <span className="text-[10px] font-bold text-black">{t.aiAdvisor}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <main className="min-h-[600px] mb-20 md:mb-0">
          {view === ViewState.DASHBOARD && (
            <Dashboard 
              students={loans} 
              language={language} 
              isDark={isDark} 
              currencySymbol={currencySymbol} 
              currencyRate={currencyRate} 
            />
          )}
          {view === ViewState.MANAGE && (
            <StudentList 
              students={loans} 
              onAddStudent={handleAddLoan}
              onUpdateStudent={handleUpdateLoan}
              onDeleteStudent={handleDeleteLoan}
              language={language}
              isDark={isDark}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          )}
          {view === ViewState.BUDGET && (
            <BudgetPlanner 
                language={language}
                expenses={expenses}
                goals={goals}
                onAddExpense={(e) => setExpenses([...expenses, e])}
                onAddGoal={(g) => setGoals([...goals, g])}
                isDark={isDark}
                currencySymbol={currencySymbol}
                currencyRate={currencyRate}
            />
          )}
          {view === ViewState.DAILY && (
            <DailyAnalysis 
              students={loans} 
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              loanTermYears={loanTermYears}
              setLoanTermYears={setLoanTermYears}
              language={language}
              isDark={isDark}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          )}
          {view === ViewState.INSIGHTS && (
            <AIAdvisor 
              students={loans} 
              language={language} 
              isDark={isDark} 
              currencySymbol={currencySymbol}
            />
          )}
        </main>
        
        <footer className={`mt-20 py-6 border-t text-center text-sm hidden md:block ${isDark ? 'border-white/10 text-white/40' : 'border-slate-200 text-slate-400'}`}>
          <p>© 2024 EduEasy. Intelligent Student Finance.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
