export type Language = 'en' | 'ar' | 'tr' | 'ru' | 'fr' | 'de';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'ILS' | 'JOD' | 'TRY' | 'INR' | 'AED' | 'SAR' | 'CAD' | 'AUD';
export type TrialStatus = 'not_started' | 'active' | 'expired' | 'subscribed';
export type ItemStatus = 'pending' | 'handled' | 'overdue' | 'due_today' | 'upcoming';

export interface User {
  name: string;
  email: string;
  language: Language;
  direction: 'ltr' | 'rtl';
  currency: Currency;
  trialStartDate?: string;
  trialEndDate?: string;
  trialStatus: TrialStatus;
  subscriptionStatus: 'free' | 'pro';
  monthlyIncome: number;
  fixedBills: number;
  rent: number;
  onboardingCompleted: boolean;
}

export interface Reminder {
  id: string;
  itemId: string;
  date: string;
  time: string;
  type: 'on_due_date' | '1_day_before' | '3_days_before' | '7_days_before';
  status: 'pending' | 'sent';
}

export interface AppItem {
  id: string;
  title: string;
  provider: string;
  type: 'bill' | 'receipt' | 'document' | 'subscription' | 'warranty' | 'other';
  category: string;
  amount: number;
  currency: Currency;
  date: string;
  dueDate?: string;
  recurring: boolean;
  recurringFrequency?: 'monthly' | 'yearly' | 'weekly';
  actionRequired: boolean;
  priority: 'low' | 'medium' | 'high';
  status: ItemStatus;
  source: 'image' | 'text' | 'voice' | 'manual';
  notes?: string;
  summary?: string;
  reminder?: Reminder;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  currency: Currency;
  category: string;
  merchant: string;
  description: string;
  date: string;
  recurring: boolean;
  notes?: string;
  createdAt: string;
}

export interface AppState {
  user: User;
  items: AppItem[];
  expenses: Expense[];
  isInitialized: boolean;
}
