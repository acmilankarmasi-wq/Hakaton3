
// @ts-ignore
import React, { useState } from 'react';
import { SavingsGoal, Expense, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { generateId } from '../utils/helpers';
// @ts-ignore
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// @ts-ignore
import { Plus, Trash2, Target, CreditCard, TrendingUp, CheckCircle } from 'lucide-react';
import { CardEntryModal } from './CardEntryModal';

interface BudgetPlannerProps {
  language: LanguageCode;
  expenses: Expense[];
  goals: SavingsGoal[];
  onAddExpense: (expense: Expense) => void;
  onAddGoal: (goal: SavingsGoal) => void;
  isDark?: boolean;
  currencySymbol: string;
  currencyRate: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ language, expenses, goals, onAddExpense, onAddGoal, isDark = true, currencySymbol, currencyRate }) => {
  const t = translations[language];
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', name: '' });
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '' });
  
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);
  
  // Withdrawal State
  const [withdrawingGoalId, setWithdrawingGoalId] = useState<string | null>(null);

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount) {
      onAddExpense({
        id: generateId(),
        category: newExpense.category,
        amount: Number(newExpense.amount),
        name: newExpense.name || newExpense.category
      });
      setNewExpense({ category: '', amount: '', name: '' });
    }
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target) {
      onAddGoal({
        id: generateId(),
        title: newGoal.title,
        targetAmount: Number(newGoal.target),
        currentAmount: Number(newGoal.current) || 0,
        color: COLORS[goals.length % COLORS.length]
      });
      setNewGoal({ title: '', target: '', current: '' });
    }
  };

  const handleWithdraw = () => {
    // Simulate API call or logic
    setWithdrawingGoalId(null);
    alert("Withdrawal successful! Funds sent to card.");
  };

  // Chart Data
  const expenseData = expenses.map((e, index) => ({
    name: e.category,
    value: e.amount
  }));

  // Styles
  const cardClass = isDark ? "bg-white/10 backdrop-blur-md border-white/20 text-white" : "bg-white border-slate-200 text-slate-800 shadow-sm";
  const inputClass = isDark ? "bg-black/20 border-white/10 text-white" : "bg-slate-100 border-slate-300 text-slate-800";
  
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses Section */}
        <div className={`rounded-2xl p-6 border ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <CreditCard className="text-red-400" />
              {t.expenses}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <input placeholder={t.category} value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className={`w-full border rounded-lg px-3 py-2 text-sm ${inputClass}`} />
                <input type="number" placeholder={t.amount} value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className={`w-full border rounded-lg px-3 py-2 text-sm ${inputClass}`} />
                <button onClick={handleAddExpense} className="w-full bg-red-500 hover:bg-red-400 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                  {t.addExpense}
                </button>
              </div>
              
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2">
                {expenses.map(exp => {
                    const isActive = activeExpenseId === exp.id;
                    // Styling logic for active state based on mode
                    let itemStyle = "";
                    if (isActive) {
                        itemStyle = isDark ? "bg-black text-white" : "bg-white text-black shadow-md border-slate-300";
                    } else {
                        itemStyle = isDark ? "bg-white/5 text-white/80" : "bg-slate-50 text-slate-700";
                    }

                    return (
                        <div 
                            key={exp.id} 
                            onClick={() => setActiveExpenseId(isActive ? null : exp.id)}
                            className={`flex justify-between items-center p-3 rounded-lg text-sm cursor-pointer transition-all border border-transparent ${itemStyle}`}
                        >
                            <span className="font-medium">{exp.category}</span>
                            <span className="font-mono opacity-90">{currencySymbol}{(exp.amount * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    );
                })}
              </div>
            </div>
            
            <div className="flex-1 min-h-[200px]">
                {expenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={expenseData} innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : '#fff', borderRadius: '8px', border: isDark ? 'none' : '1px solid #e2e8f0', color: isDark ? '#fff' : '#1e293b' }} />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={`h-full flex items-center justify-center text-xs italic ${isDark ? 'text-white/30' : 'text-slate-400'}`}>No expenses added</div>
                )}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className={`rounded-2xl p-6 border ${cardClass}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Target className="text-green-400" />
                {t.savingsGoals}
                </h2>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input placeholder="Goal Title" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className={`flex-1 border rounded-lg px-3 py-2 text-sm ${inputClass}`} />
                    <input type="number" placeholder={`Target ${currencySymbol}`} value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} className={`w-24 border rounded-lg px-3 py-2 text-sm ${inputClass}`} />
                </div>
                <button onClick={handleAddGoal} className="w-full bg-green-600 hover:bg-green-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                  {t.addGoal}
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {goals.map(goal => {
                    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                    return (
                        <div key={goal.id} className={`p-4 rounded-xl border relative group ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{goal.title}</span>
                                <span className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{currencySymbol}{(goal.currentAmount * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })} / {currencySymbol}{(goal.targetAmount * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                <div 
                                    className="h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${progress}%`, backgroundColor: goal.color }}
                                />
                            </div>
                            
                            {/* Withdraw Action */}
                            <div className="mt-3 flex justify-end">
                                <button 
                                    onClick={() => setWithdrawingGoalId(goal.id)}
                                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-green-500 hover:text-white transition-colors ${isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-50'}`}
                                >
                                    <CheckCircle size={14} /> {t.withdrawFunds}
                                </button>
                            </div>
                        </div>
                    );
                })}
                 {goals.length === 0 && (
                    <div className={`text-center text-xs italic py-8 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>Set a goal to start saving!</div>
                )}
            </div>
        </div>
      </div>
      
      <CardEntryModal 
        isOpen={!!withdrawingGoalId}
        onClose={() => setWithdrawingGoalId(null)}
        onSubmit={handleWithdraw}
        language={language}
        isDark={isDark}
        title={t.withdrawFunds}
        submitLabel="Withdraw to Card"
      />
    </div>
  );
};