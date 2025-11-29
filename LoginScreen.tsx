
// @ts-ignore
import React, { useState } from 'react';
import { translations, SUPPORTED_LANGUAGES } from '../utils/translations';
import { LanguageCode } from '../types';
// @ts-ignore
import { Building2, GraduationCap, Calculator, RefreshCw, Globe, ShieldCheck, Mail, Lock, ScanFace } from 'lucide-react';
import { CreditCalculator } from './CreditCalculator';

interface LoginScreenProps {
  onLogin: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, language, setLanguage }) => {
  const t = translations[language];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  
  // Feature States
  const [showCalculator, setShowCalculator] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 9);
    
    let formatted = '';
    if (limitedDigits.length > 0) formatted += limitedDigits.slice(0, 2);
    if (limitedDigits.length > 2) formatted += ' ' + limitedDigits.slice(2, 5);
    if (limitedDigits.length > 5) formatted += ' ' + limitedDigits.slice(5, 7);
    if (limitedDigits.length > 7) formatted += ' ' + limitedDigits.slice(7, 9);
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const cleanInput = val.replace(/\D/g, ''); 
    setPhone(cleanInput.slice(0, 9));
  };

  const handleLogin = () => {
    setError('');
    
    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setError(t.loginErrorGmail || "Please enter a valid @gmail.com address");
      return;
    }

    if (!password) {
        setError("Password is required.");
        return;
    }

    if (phone.length < 9) {
      setError(t.loginErrorPhone || "Invalid phone number");
      return;
    }

    onLogin();
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-800 font-sans">
      {/* Left Side - Image & About (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-end">
        <div className="absolute inset-0 z-0">
             <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop" 
                alt="Students Graduating" 
                className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-blue-900/95 via-blue-900/60 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 p-12 text-white max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <ShieldCheck size={32} className="text-blue-300" />
             </div>
             <div>
                <h1 className="text-4xl font-bold tracking-tight">EduEasy</h1>
                <p className="text-blue-200 text-sm font-medium tracking-wide uppercase">Intelligent Student Finance</p>
             </div>
          </div>
          
          <div className="space-y-4 text-white/80 leading-relaxed text-sm backdrop-blur-sm bg-black/10 p-6 rounded-2xl border border-white/10 h-[400px] overflow-y-auto custom-scrollbar">
            <div className="font-light whitespace-pre-wrap">
                {t.aboutEduEasy}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        
        {/* Language Selector Top Right */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
            <Globe size={16} className="text-slate-400" />
            <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageCode)}
            className="bg-transparent text-sm text-slate-600 font-medium focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
            >
            {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
            ))}
            </select>
        </div>

        <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
          
          {/* Logos */}
          <div className="flex items-center justify-center gap-8 w-full px-4">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30">
                    <Building2 size={24} className="text-[#D4AF37]" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide max-w-[100px] leading-tight">
                    {t.ministryName}
                </span>
             </div>

             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-600/30">
                    <GraduationCap size={24} className="text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide max-w-[100px] leading-tight">
                    {t.fundName}
                </span>
             </div>
          </div>

          <h1 className="text-2xl font-semibold text-blue-900 tracking-tight">
            {t.digitalLogin}
          </h1>

          {/* Form */}
          <div className="w-full space-y-4">
            
            {/* Email */}
            <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.loginEmailPlaceholder || "Enter Gmail"} 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                />
            </div>

            {/* Password */}
            <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.loginPasswordPlaceholder || "Password"} 
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white"
                />
            </div>

            {/* Phone with AZ Flag */}
            <div className="relative group">
                 <div className="absolute left-3 top-3.5 flex items-center gap-2 border-r pr-2 border-slate-300">
                    <img 
                        src="https://flagcdn.com/w20/az.png" 
                        srcSet="https://flagcdn.com/w40/az.png 2x" 
                        width="20" 
                        height="15" 
                        alt="Azerbaijan" 
                        className="rounded-sm shadow-sm"
                    />
                    <span className="text-sm font-bold text-slate-600">+994</span>
                 </div>
                <input 
                    type="text" 
                    value={formatPhone(phone)}
                    onChange={handlePhoneChange}
                    placeholder="XX XXX XX XX" 
                    className={`w-full pl-28 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-slate-50 focus:bg-white font-mono ${isChangingPhone ? 'ring-2 ring-yellow-400 border-yellow-400' : ''}`}
                    autoFocus={isChangingPhone}
                    onBlur={() => setIsChangingPhone(false)}
                />
            </div>
            
            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-pulse">
                    {error}
                </div>
            )}

            <button 
                onClick={handleLogin}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-bold transition-all shadow-lg shadow-blue-500/30 transform active:scale-95"
            >
                {t.digitalLogin}
            </button>
            
            <button 
                onClick={onLogin} // Keep biometric as bypass for demo
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
                <ScanFace size={18} />
                {t.biometricLogin}
            </button>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="flex gap-4 w-full">
            <button 
                onClick={() => setShowCalculator(true)}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 border border-slate-200 rounded-lg text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
            >
                <Calculator size={16} />
                {t.creditCalc}
            </button>
            <button 
                onClick={() => {
                    setIsChangingPhone(true);
                    setPhone('');
                }}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 border border-slate-200 rounded-lg text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
            >
                <RefreshCw size={16} />
                {t.changeNum}
            </button>
          </div>

        </div>
      </div>
      
      <CreditCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)}
        language={language}
      />
    </div>
  );
};
