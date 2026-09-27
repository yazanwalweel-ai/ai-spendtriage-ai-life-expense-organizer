import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Expense, Currency } from '../../types';
import { translations } from '../../translations';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, expense }) => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  
  const [formData, setFormData] = useState<Partial<Expense>>(expense || {
    amount: 0,
    currency: state.user.currency,
    category: 'food',
    merchant: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.amount || formData.amount <= 0) return;

    const expenseData: Expense = {
      id: expense?.id || Math.random().toString(36).substr(2, 9),
      amount: Number(formData.amount),
      currency: formData.currency as Currency,
      category: formData.category || 'general',
      merchant: formData.merchant || 'Unknown',
      description: formData.description || '',
      date: formData.date || new Date().toISOString().split('T')[0],
      recurring: !!formData.recurring,
      createdAt: expense?.createdAt || new Date().toISOString()
    };

    if (expense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expenseData });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-[#F3F1EE] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2D4F3C]">{expense ? t.common.edit : t.money.logExpense}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F3F1EE] rounded-full transition-colors">
            <X size={20} className="text-[#A3A3A3]" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full p-4 bg-[#F3F1EE] rounded-2xl font-bold text-2xl text-[#2D4F3C] focus:outline-none focus:ring-2 focus:ring-[#2D4F3C]/10"
                placeholder="0.00"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-[#2D4F3C]">
                {formData.currency}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
              >
                <option value="food">Food & Drink</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="health">Health</option>
                <option value="general">General</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Merchant / Description</label>
            <input
              type="text"
              value={formData.merchant}
              onChange={e => setFormData({ ...formData, merchant: e.target.value })}
              className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
              placeholder="e.g. Starbucks"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#F3F1EE] rounded-2xl">
            <span className="text-sm font-medium text-[#2D4F3C]">Recurring monthly</span>
            <button
              onClick={() => setFormData({ ...formData, recurring: !formData.recurring })}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.recurring ? 'bg-[#2D4F3C]' : 'bg-[#D1D1D1]'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.recurring ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#F3F1EE]/50">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#2D4F3C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2D4F3C]/20"
          >
            <Save size={20} />
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
};
