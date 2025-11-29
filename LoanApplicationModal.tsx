
// @ts-ignore
import React, { useState, useEffect } from 'react';
import { LoanRecord, LanguageCode } from '../types';
import { translations } from '../utils/translations';
import { generateId } from '../utils/helpers';
// @ts-ignore
import { X, Check, ChevronRight, ChevronLeft, FileText, Loader2, ShieldCheck, User, Building, AlertCircle, FileCheck } from 'lucide-react';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (loan: LoanRecord) => void;
  language: LanguageCode;
  isDark: boolean;
  currencySymbol: string;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  isDark,
  currencySymbol
}) => {
  const t = translations[language];
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    // Personal
    fin: '',
    name: '',
    surname: '',
    fatherName: '',
    dob: '',
    mobile: '+994 ',
    email: '',
    // Education
    institution: '',
    specialty: '',
    level: 'Bachelor',
    form: 'Full-time',
    isPaid: true,
    // Eligibility
    academicDebt: false,
    loanType: 'Standard STL',
    loanAmount: '',
    socialHelp: false,
    disability: 'None',
    pension: false,
    // Consents
    consentAgreement: false,
    consentData: false,
    consentTerms: false
  });

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGeneratedDocs([]);
      setProcessing(false);
      setCompleted(false);
      setShowTerms(false);
    }
  }, [isOpen]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setProcessing(true);
    
    // Simulate Document Generation
    const docs = [t.docIdentity, t.docEdu, t.docSocial, t.docRisk];
    
    for (const doc of docs) {
      await new Promise(r => setTimeout(r, 800)); // Simulate delay
      setGeneratedDocs(prev => [...prev, doc]);
    }
    
    await new Promise(r => setTimeout(r, 500));
    
    // Create Loan Record
    const newLoan: LoanRecord = {
      id: generateId(),
      title: `${formData.loanType} - ${formData.specialty}`,
      category: 'Education',
      monthlyIncome: 0,
      amount: Number(formData.loanAmount) || 0
    };
    
    onSuccess(newLoan);
    setProcessing(false);
    setCompleted(true); // Switch to success view
  };

  if (!isOpen) return null;

  const inputClass = isDark ? "bg-black/20 border-white/10 text-white placeholder-white/30" : "bg-white border-slate-300 text-slate-800 placeholder-slate-400";
  const labelClass = isDark ? "text-white/70" : "text-slate-600";
  const headingClass = isDark ? "text-white" : "text-slate-900";
  const cardClass = isDark ? "bg-[#1a1f2e] border-white/10" : "bg-white border-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${cardClass}`}>
        
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
          {!completed ? (
            <div>
              <h2 className={`text-xl font-bold ${headingClass}`}>{t.addLoan}</h2>
              <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-blue-500' : `w-2 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`}`}></div>
                  ))}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <button onClick={onClose} className={`p-2 rounded-full hover:bg-black/10 transition-colors ${isDark ? 'text-white' : 'text-slate-500'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {completed ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/30">
                    <Check size={40} />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${headingClass}`}>{t.loanResponseShort}</h2>
                <p className={`text-lg italic mb-8 opacity-70 ${headingClass}`}>{t.loanResponseDays}</p>

                {!showTerms ? (
                    <button 
                        onClick={() => setShowTerms(true)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-medium transition-all ${isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                    >
                        <FileCheck size={18} /> {t.seeLoanTerms}
                    </button>
                ) : (
                    <div className={`w-full max-w-md p-6 rounded-xl border text-left animate-slideIn ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                        <h3 className={`font-bold border-b pb-2 mb-3 ${isDark ? 'text-white border-white/10' : 'text-slate-800 border-slate-200'}`}>{t.loanTermsTitle}</h3>
                        <div className={`space-y-2 text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                            <div className="flex justify-between">
                                <span>{t.loanAmount}:</span>
                                <span className="font-mono font-bold">{currencySymbol}{formData.loanAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t.loanType}:</span>
                                <span>{formData.loanType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t.institution}:</span>
                                <span>{formData.institution}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Repayment:</span>
                                <span>Standard Term (10 Years)</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          ) : (
             // Normal Wizard Steps (Condensed for brevity, same logic as before but updated structure)
             <>
               {step === 1 && (
                 <div className="space-y-6 animate-slideIn">
                    {/* ... Step 1 Fields ... */}
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${headingClass}`}>{t.stepPersonal}</h3>
                            <p className={`text-xs ${labelClass}`}>Required for identity verification</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.finCode}</label><input value={formData.fin} onChange={e => setFormData({...formData, fin: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} placeholder="7 chars" /></div>
                        <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.name}</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} /></div>
                        <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.surname}</label><input value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} /></div>
                        <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.mobileNum}</label><input value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} /></div>
                        <div className="col-span-full space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.emailAddr}</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} /></div>
                    </div>
                 </div>
               )}
               {step === 2 && (
                 <div className="space-y-6 animate-slideIn">
                    {/* ... Step 2 Fields ... */}
                     <div className="flex items-center gap-3 mb-4"><div className="p-3 bg-purple-500/20 rounded-lg text-purple-500"><Building size={24} /></div><div><h3 className={`text-lg font-bold ${headingClass}`}>{t.stepEducation}</h3></div></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="col-span-full space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.institution}</label><select value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`}><option value="">Select University</option><option value="BDU">Baku State University</option><option value="UNEC">UNEC</option></select></div>
                         <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.specialty}</label><input value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} /></div>
                         <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.loanAmountReq}</label><div className="relative"><span className={`absolute left-3 top-3 ${labelClass}`}>{currencySymbol}</span><input type="number" value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: e.target.value})} className={`w-full p-3 pl-8 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`} placeholder="2000" /></div></div>
                     </div>
                 </div>
               )}
               {step === 3 && (
                 <div className="space-y-6 animate-slideIn">
                    {/* ... Step 3 Fields ... */}
                    <div className="flex items-center gap-3 mb-4"><div className="p-3 bg-orange-500/20 rounded-lg text-orange-500"><AlertCircle size={24} /></div><div><h3 className={`text-lg font-bold ${headingClass}`}>{t.stepEligibility}</h3></div></div>
                    <div className={`p-4 rounded-xl border mb-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}><label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={formData.academicDebt} onChange={e => setFormData({...formData, academicDebt: e.target.checked})} className="mt-1 accent-blue-600 w-5 h-5" /><div><span className={`block font-medium ${headingClass}`}>{t.academicDebt}</span></div></label></div>
                    <div className="space-y-1"><label className={`text-xs font-bold uppercase ${labelClass}`}>{t.loanType}</label><select value={formData.loanType} onChange={e => setFormData({...formData, loanType: e.target.value})} className={`w-full p-3 rounded-lg border focus:border-blue-500 outline-none transition-all ${inputClass}`}><option value="Standard STL">{t.standardStl}</option><option value="Social STL">{t.socialStl}</option></select></div>
                 </div>
               )}
               {step === 4 && (
                 <div className="space-y-6 animate-slideIn">
                    <div className="flex items-center gap-3 mb-6"><div className="p-3 bg-green-500/20 rounded-lg text-green-500"><ShieldCheck size={24} /></div><div><h3 className={`text-lg font-bold ${headingClass}`}>{t.stepConsents}</h3></div></div>
                    {processing ? (
                        <div className="space-y-4 py-8">
                             <div className="flex items-center justify-center gap-2 mb-6"><Loader2 className="animate-spin text-blue-500" size={24} /><span className={`${headingClass} font-medium`}>{t.processingDocs}</span></div>
                             <div className="grid gap-3">{generatedDocs.map((doc, idx) => (<div key={idx} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg animate-fadeIn"><FileText className="text-green-500" size={20} /><span className={`text-sm flex-1 ${headingClass}`}>{doc}</span><Check className="text-green-500" size={16} /></div>))}</div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={formData.consentData} onChange={e => setFormData({...formData, consentData: e.target.checked})} className="mt-1 accent-blue-600 w-5 h-5" /><span className={`text-sm ${headingClass}`}>{t.consentData}</span></label>
                                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={formData.consentTerms} onChange={e => setFormData({...formData, consentTerms: e.target.checked})} className="mt-1 accent-blue-600 w-5 h-5" /><span className={`text-sm ${headingClass}`}>{t.consentTerms}</span></label>
                                <label className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={formData.consentAgreement} onChange={e => setFormData({...formData, consentAgreement: e.target.checked})} className="mt-1 accent-blue-600 w-5 h-5" /><span className={`text-sm ${headingClass}`}>{t.consentAgreement}</span></label>
                            </div>
                        </div>
                    )}
                 </div>
               )}
             </>
          )}
        </div>

        {/* Footer Actions */}
        {!completed && (
            <div className={`p-6 border-t flex justify-between ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
            {step > 1 && !processing && (
                <button onClick={handleBack} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>
                    <ChevronLeft size={18} /> {t.back}
                </button>
            )}
            {step === 1 && <div />}

            {step < 4 && (
                <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg hover:shadow-blue-500/25 transition-all">
                    {t.next} <ChevronRight size={18} />
                </button>
            )}

            {step === 4 && !processing && (
                <button 
                    onClick={handleSubmit} 
                    disabled={!formData.consentAgreement || !formData.consentData || !formData.consentTerms}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all ${
                        (!formData.consentAgreement || !formData.consentData || !formData.consentTerms) 
                        ? 'bg-slate-500/50 cursor-not-allowed text-white/50' 
                        : 'bg-green-600 hover:bg-green-500 text-white hover:shadow-green-500/25'
                    }`}
                >
                    {t.submitApplication} <Check size={18} />
                </button>
            )}
            </div>
        )}

      </div>
    </div>
  );
};
