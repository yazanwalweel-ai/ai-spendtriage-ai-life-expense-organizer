import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { formatCurrency } from '../../utils/currency';
import { TrendingUp, TrendingDown, CreditCard, PieChart, Plus, Trash2 } from 'lucide-react';
import { ExpenseModal } from '../modals/ExpenseModal';
import { Expense } from '../../types';

export const Money: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const committed = state.items
    .filter(i => i.status !== 'handled')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const spent = state.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = state.user.monthlyIncome - committed - spent;

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D4F3C] mb-2">{t.common.money}</h1>
        <p className="text-[#A3A3A3]">Financial overview for this month</p>
      </header>

      <div className="bg-white p-8 rounded-[2.5rem] border border-[#E8E5E0] shadow-sm mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-2 uppercase">
          {t.money.remaining}
        </p>
        <h2 className="text-4xl font-bold text-[#2D4F3C] mb-8">
          {formatCurrency(remaining, state.user.currency)}
        </h2>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 text-[#10b981] mb-1">
              <TrendingUp size={14} />
              <span className="text-[10px] font-bold uppercase">{t.money.income}</span>
            </div>
            <p className="text-lg font-bold text-[#2D4F3C]">
              {formatCurrency(state.user.monthlyIncome, state.user.currency)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-red-500 mb-1">
              <TrendingDown size={14} />
              <span className="text-[10px] font-bold uppercase">{t.money.spent}</span>
            </div>
            <p className="text-lg font-bold text-[#2D4F3C]">
              {formatCurrency(spent, state.user.currency)}
            </p>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] uppercase">
            Recent Expenses
          </p>
        </div>
        <div className="space-y-3">
          {state.expenses.slice(0, 5).map(expense => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E8E5E0] group"
              onClick={() => handleEditExpense(expense)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F3F1EE] rounded-xl flex items-center justify-center text-[#2D4F3C]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#2D4F3C]">{expense.merchant}</p>
                  <p className="text-[10px] text-[#A3A3A3] uppercase">{expense.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-[#2D4F3C]">
                  {formatCurrency(expense.amount, expense.currency)}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteExpense(expense.id);
                  }}
                  className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {state.expenses.length === 0 && (
            <p className="text-center py-8 text-sm text-[#A3A3A3]">No expenses logged yet.</p>
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="bg-[#F3F1EE] p-6 rounded-[2rem]">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-[#2D4F3C]" />
            <h3 className="font-bold text-[#2D4F3C]">{t.money.insight}</h3>
          </div>
          <p className="text-sm text-[#706F6C] leading-relaxed">
            {spent > 0 
              ? `You've spent ${formatCurrency(spent, state.user.currency)} so far. Based on your income, you have ${formatCurrency(remaining / 30, state.user.currency)} safe to spend daily.`
              : "Log your first expense to get personalized AI spending insights."}
          </p>
        </div>
      </section>

      <button 
        onClick={() => {
          setEditingExpense(undefined);
          setIsExpenseModalOpen(true);
        }}
        className="w-full py-5 bg-[#2D4F3C] text-white rounded-[2rem] font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2D4F3C]/20"
      >
        <Plus size={20} />
        {t.money.logExpense}
      </button>

      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        expense={editingExpense}
      />
    </div>
  );
};
