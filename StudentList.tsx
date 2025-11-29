
// @ts-ignore
import React, { useState } from 'react';
import { LoanRecord, LanguageCode } from '../types';
import { translations } from '../utils/translations';
// @ts-ignore
import { Plus, Trash2, Edit2, Save, X, Wallet, CreditCard, FileText } from 'lucide-react';
import { LoanApplicationModal } from './LoanApplicationModal';

interface StudentListProps {
  students: LoanRecord[];
  onAddStudent: (student: LoanRecord) => void;
  onUpdateStudent: (student: LoanRecord) => void;
  onDeleteStudent: (id: string) => void;
  language: LanguageCode;
  isDark?: boolean;
  currencySymbol: string;
  currencyRate: number;
}

export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent, 
  language, 
  isDark = true,
  currencySymbol,
  currencyRate
}) => {
  const t = translations[language];
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit Form State
  const [formData, setFormData] = useState<Partial<LoanRecord>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyIncome' || name === 'amount' ? Number(value) : value
    }));
  };

  const startEdit = (student: LoanRecord) => {
    setFormData(student);
    setEditingId(student.id);
  };

  const saveEdit = () => {
    if (formData.id && formData.title && formData.category) {
      onUpdateStudent({
        id: formData.id,
        title: formData.title,
        category: formData.category,
        monthlyIncome: formData.monthlyIncome || 0,
        amount: formData.amount || 0
      });
      setEditingId(null);
    }
  };

  // Styles
  const containerClass = isDark ? "bg-white/10 backdrop-blur-md border-white/20 shadow-xl" : "bg-white border-slate-200 shadow-md";
  const headerClass = isDark ? "border-white/10 bg-black/10 text-white" : "border-slate-100 bg-slate-50 text-slate-800";
  const tableHeadClass = isDark ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-500";
  const rowClass = isDark ? "hover:bg-white/5 text-white/90" : "hover:bg-slate-50 text-slate-700";
  const inputClass = isDark ? "bg-black/20 border-white/10 text-white focus:bg-black/40" : "bg-white border-slate-300 text-slate-800 focus:bg-white";

  return (
    <>
      <div className={`rounded-2xl border overflow-hidden animate-fadeIn ${containerClass}`}>
        {/* Header Section */}
        <div className={`p-6 flex justify-between items-center border-b ${headerClass}`}>
          <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                  <FileText size={24} />
              </div>
              <div>
                  <h2 className="text-xl font-semibold">{t.studentRecords}</h2>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>Manage your loans and income sources</p>
              </div>
          </div>
          
          {/* Add Loan Button - Triggers Wizard */}
          {!editingId && (
            <button 
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-blue-500/25 font-medium text-sm transform hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              {t.addLoan}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className={`uppercase text-xs font-semibold tracking-wider ${tableHeadClass}`}>
              <tr>
                <th className="px-6 py-4">{t.name}</th>
                <th className="px-6 py-4">{t.major}</th>
                <th className="px-6 py-4">{t.monthlySalary}</th>
                <th className="px-6 py-4">{t.totalLoan}</th>
                <th className="px-6 py-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              
              {/* Existing Rows */}
              {students.map((student) => (
                <tr key={student.id} className={`transition-colors group ${rowClass}`}>
                  {editingId === student.id ? (
                    <>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                              <CreditCard size={14} />
                          </div>
                          <input name="title" value={formData.title || ''} onChange={handleInputChange} className={`${inputClass} border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-blue-400`} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input name="category" value={formData.category || ''} onChange={handleInputChange} className={`${inputClass} border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-blue-400`} />
                      </td>
                      <td className="px-6 py-4">
                        <input name="monthlyIncome" type="number" value={formData.monthlyIncome || ''} onChange={handleInputChange} className={`${inputClass} border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-blue-400`} />
                      </td>
                      <td className="px-6 py-4">
                        <input name="amount" type="number" value={formData.amount || ''} onChange={handleInputChange} className={`${inputClass} border rounded-lg px-3 py-1.5 w-full focus:outline-none focus:border-blue-400`} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={saveEdit} title={t.save} className="p-2 bg-green-500/80 hover:bg-green-500 rounded-lg text-white"><Save size={16}/></button>
                          <button onClick={() => setEditingId(null)} title={t.cancel} className={`p-2 rounded-lg ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}><X size={16}/></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/10 text-white/60 group-hover:bg-blue-500/20 group-hover:text-blue-300' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                              <CreditCard size={14} />
                          </div>
                          {student.title}
                      </td>
                      <td className="px-6 py-4 opacity-70">{student.category}</td>
                      <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-500 border border-green-500/20 font-mono text-sm">
                             {currencySymbol}{(student.monthlyIncome * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                      </td>
                      <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 font-mono text-sm">
                             {currencySymbol}{(student.amount * currencyRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => startEdit(student)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-blue-300 hover:text-white hover:bg-blue-600' : 'text-blue-600 hover:text-white hover:bg-blue-600'}`}><Edit2 size={16}/></button>
                          <button onClick={() => onDeleteStudent(student.id)} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-red-300 hover:text-white hover:bg-red-600' : 'text-red-600 hover:text-white hover:bg-red-600'}`}><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className={`px-6 py-16 text-center italic ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                    <div className="flex flex-col items-center gap-3">
                      <Wallet size={32} className="opacity-50" />
                      <p>{t.noRecords}</p>
                      <button onClick={() => setIsWizardOpen(true)} className="text-blue-500 hover:text-blue-400 underline text-sm mt-1">{t.addLoan}</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LoanApplicationModal 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={onAddStudent}
        language={language}
        isDark={isDark}
        currencySymbol={currencySymbol}
      />
    </>
  );
};
