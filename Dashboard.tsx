// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
// @ts-ignore
} from 'recharts';
import { LoanRecord, FinancialStats, LanguageCode } from '../types';
import { translations } from '../utils/translations';
// @ts-ignore
import { Users, DollarSign, TrendingUp, AlertCircle, ArrowUpRight, WalletCards, CreditCard, Lock, Eye, EyeOff } from 'lucide-react';
import { CardEntryModal } from './CardEntryModal';

interface DashboardProps {
  students: LoanRecord[];
  language: LanguageCode;
  isDark?: boolean;
  currencySymbol: string;
  currencyRate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<DashboardProps> = ({ students, language, isDark = true, currencySymbol, currencyRate }) => {
  const t = translations[language];
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [fundsRevealed, setFundsRevealed] = useState(false);
  const [hasPendingFunds, setHasPendingFunds] = useState(true);

  // Calculate stats for single user's loan portfolio
  const stats: FinancialStats = React.useMemo(() => {
    const totalLoansCount = students.length;
    if (totalLoansCount === 0) return { totalLoansCount: 0, totalIncome: 0, totalDebt: 0, averageLoanSize: 0, debtToIncomeRatio: 0 };

    const userIncome = students[0].monthlyIncome;
    const totalIncome = userIncome * currencyRate;
    const totalDebt = students.reduce((acc, s) => acc + s.amount, 0) * currencyRate;

    return {
      totalLoansCount,
      totalIncome,
      totalDebt,
      averageLoanSize: totalDebt / totalLoansCount,
      debtToIncomeRatio: (totalDebt / (totalIncome * 12 || 1))
    };
  }, [students, currencyRate]);

  const chartData = students.map(s => ({
    name: s.title,
    Income: s.monthlyIncome * currencyRate,
    Loan: s.amount * currencyRate
  }));

  const categoryData = React.useMemo(() => {
    const counts: {[key: string]: number} = {};
    students.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [students]);

  const handleCardSubmit = () => {
    setFundsRevealed(true);
    setShowFundsModal(false);
  };

  const handleTransfer = () => {
     alert("Transfer initiated to your card!");
     setHasPendingFunds(false);
  };

  // Styling Helpers
  const cardClass = isDark
    ? "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-lg"
    : "bg-white border-slate-200 text-slate-800 shadow-sm";

  const textSub = isDark ? "text-white/70" : "text-slate-500";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const tickColor = isDark ? "rgba(255,255,255,0.6)" : "#64748b";

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Pending Funds Widget (Admin/Wallet) */}
      {hasPendingFunds && (
        <div className={`p-6 rounded-2xl border relative overflow-hidden group ${isDark ? 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 border-emerald-500/30' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-500">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-emerald-900'}`}>{t.pendingFunds}</h3>
                        <p className={`text-sm ${isDark ? 'text-emerald-200' : 'text-emerald-600'}`}>{t.fundsAvailable}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {fundsRevealed ? (
                        <div className="flex items-center gap-4 animate-fadeIn">
                            <span className="text-3xl font-mono font-bold text-emerald-400">{currencySymbol}2,500</span>
                            <button
                                onClick={handleTransfer}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                {t.transferToCard}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowFundsModal(true)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed font-mono text-xl transition-all ${isDark ? 'border-white/30 text-white/50 hover:text-white hover:border-white' : 'border-emerald-200 text-emerald-400 hover:text-emerald-600 hover:border-emerald-400'}`}
                        >
                            <span className="tracking-[0.5em] font-bold">???</span>
                            <span className="text-xs font-sans opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">{t.clickToReveal}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-2xl border ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSub}`}>{t.totalBorrowers}</h3>
            <WalletCards className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold">{stats.totalLoansCount}</p>
        </div>

        <div className={`p-6 rounded-2xl border ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSub}`}>{t.avgSalary}</h3>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold">{currencySymbol}{stats.totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>

        <div className={`p-6 rounded-2xl border ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSub}`}>{t.totalOutstanding}</h3>
            <TrendingUp className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold">{currencySymbol}{stats.totalDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>

        <div className={`p-6 rounded-2xl border ${cardClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-medium ${textSub}`}>{t.avgLoan}</h3>
            <AlertCircle className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold">{currencySymbol}{stats.averageLoanSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Peer Comparison Widget */}
      <div className={`p-6 rounded-2xl border shadow-lg flex items-center justify-between ${isDark ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-white/20' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100'}`}>
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isDark ? 'bg-white/10 text-yellow-300' : 'bg-white text-yellow-500 shadow-sm'}`}>
                <ArrowUpRight size={24} />
            </div>
            <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.peerComparison}</h3>
                <p className={`${isDark ? 'text-white/70' : 'text-slate-500'}`}>
                    {t.peerBetter} <span className="text-green-500 font-bold">78%</span> {t.peerStudents}
                </p>
            </div>
        </div>
        <div className={`hidden md:block w-1/3 rounded-full h-3 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
             <div className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full" style={{ width: '78%' }}></div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-2xl border shadow-lg min-h-[400px] ${cardClass}`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.distribution}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={tickColor} />
              <YAxis stroke={tickColor} />
              <Tooltip
                contentStyle={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : '#fff', borderRadius: '8px', border: isDark ? 'none' : '1px solid #e2e8f0', color: isDark ? '#fff' : '#1e293b' }}
                formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`}
              />
              <Legend wrapperStyle={{ color: isDark ? '#fff' : '#1e293b' }} />
              <Bar dataKey="Income" name={t.monthlySalary} fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Loan" name={t.totalLoan} fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-2xl border shadow-lg min-h-[400px] ${cardClass}`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.byMajor}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : '#fff', borderRadius: '8px', border: isDark ? 'none' : '1px solid #e2e8f0', color: isDark ? '#fff' : '#1e293b' }} />
              <Legend wrapperStyle={{ color: isDark ? '#fff' : '#1e293b' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CardEntryModal
        isOpen={showFundsModal}
        onClose={() => setShowFundsModal(false)}
        onSubmit={handleCardSubmit}
        language={language}
        isDark={isDark}
        title={t.enterCardDetails}
        submitLabel="Link Card to Receive Funds"
      />
    </div>
  );
};
