
export interface LoanRecord {
    id: string;
    title: string; // Was name
    category: string; // Was major
    monthlyIncome: number; // Was monthlySalary (User's income)
    amount: number; // Was totalLoan
  }
  
  // Keeping alias for backward compatibility during refactor if needed, 
  // but code will shift to LoanRecord concept
  export type Student = LoanRecord; 
  
  export interface FinancialStats {
    totalLoansCount: number;
    totalIncome: number;
    totalDebt: number;
    averageLoanSize: number;
    debtToIncomeRatio: number;
  }
  
  export enum ViewState {
    DASHBOARD = 'DASHBOARD',
    MANAGE = 'MANAGE',
    DAILY = 'DAILY',
    BUDGET = 'BUDGET',
    INSIGHTS = 'INSIGHTS'
  }
  
  export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: number;
  }
  
  export type LanguageCode = 
    | 'English' 
    | 'Mandarin Chinese' 
    | 'Hindi' 
    | 'Spanish' 
    | 'Arabic' 
    | 'French' 
    | 'Bengali' 
    | 'Portuguese' 
    | 'Russian' 
    | 'Indonesian' 
    | 'Azerbaijani' 
    | 'Turkish';
  
  export type Currency = 'USD' | 'AZN';
  
  export interface Expense {
    id: string;
    category: string;
    amount: number;
    name: string;
  }
  
  export interface SavingsGoal {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    color: string;
  }
  
  export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked: boolean;
  }
  
  export interface Notification {
    id: string;
    title: string;
    message: string;
    translationKeyTitle?: string;
    translationKeyMessage?: string;
    translationParams?: Record<string, string>;
    type: 'info' | 'warning' | 'success';
    read: boolean;
    time: string;
  }
  
  export type Theme = 'light' | 'dark';
  