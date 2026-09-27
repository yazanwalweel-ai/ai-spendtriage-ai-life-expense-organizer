import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, Language, Currency, AppItem, Expense, Reminder } from '../types';
import { getDirection } from '../translations';
import { calculateItemStatus } from '../utils/date';

type Action =
  | { type: 'SET_USER'; payload: Partial<User> }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'ADD_ITEM'; payload: AppItem }
  | { type: 'UPDATE_ITEM'; payload: AppItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_REMINDER'; payload: { itemId: string; reminder: Reminder } }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'START_TRIAL' }
  | { type: 'RESET_APP' };

const initialState: AppState = {
  user: {
    name: 'Alex',
    email: '',
    language: 'en',
    direction: 'ltr',
    currency: 'USD',
    trialStatus: 'not_started',
    subscriptionStatus: 'free',
    monthlyIncome: 0,
    fixedBills: 0,
    rent: 0,
    onboardingCompleted: false,
  },
  items: [],
  expenses: [],
  isInitialized: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_LANGUAGE':
      return { 
        ...state, 
        user: { 
          ...state.user, 
          language: action.payload, 
          direction: getDirection(action.payload) 
        } 
      };
    case 'SET_CURRENCY':
      return { ...state, user: { ...state.user, currency: action.payload } };
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_ITEM':
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };
    case 'SET_REMINDER':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.itemId ? { ...i, reminder: action.payload.reminder } : i)
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, user: { ...state.user, onboardingCompleted: true } };
    case 'START_TRIAL':
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 14);
      return { 
        ...state, 
        user: { 
          ...state.user, 
          trialStatus: 'active', 
          trialStartDate: start.toISOString(), 
          trialEndDate: end.toISOString() 
        } 
      };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    const saved = localStorage.getItem('spendtriage_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Recalculate statuses on load
      parsed.items = parsed.items.map((item: AppItem) => ({
        ...item,
        status: calculateItemStatus(item.dueDate, item.status)
      }));
      return parsed;
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('spendtriage_state', JSON.stringify(state));
    document.documentElement.dir = state.user.direction;
    document.documentElement.lang = state.user.language;
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
