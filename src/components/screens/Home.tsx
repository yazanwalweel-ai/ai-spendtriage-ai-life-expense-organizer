import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { formatCurrency } from '../../utils/currency';
import { Bell, ChevronRight, AlertCircle, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BillDetailModal } from '../modals/BillDetailModal';
import { ReminderModal } from '../modals/ReminderModal';
import { AppItem } from '../../types';

export const Home: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  
  const [selectedItem, setSelectedItem] = useState<AppItem | null>(null);
  const [reminderItem, setReminderItem] = useState<AppItem | null>(null);

  const openCommitments = state.items
    .filter(i => i.status !== 'handled')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const attentionItems = state.items.filter(i => 
    (i.status === 'overdue' || i.status === 'due_today' || i.priority === 'high') && 
    i.status !== 'handled'
  );

  const safeToSpend = (state.user.monthlyIncome - state.user.fixedBills - state.user.rent) / 30;

  return (
    <div className="pb-32 pt-8 px-6 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2D4F3C]">
            {t.home.greeting}, {state.user.name} 👋
          </h1>
          <p className="text-[#A3A3A3] text-sm">
            {new Date().toLocaleDateString(state.user.language, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button className="relative p-2 bg-white rounded-full border border-[#E8E5E0] shadow-sm">
          <Bell size={20} className="text-[#2D4F3C]" />
          {state.items.some(i => i.status === 'overdue') && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </header>

      <section className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-2 uppercase">
          {t.home.openCommitments}
        </p>
        <h2 className="text-4xl font-bold text-[#2D4F3C]">
          {formatCurrency(openCommitments, state.user.currency)}
        </h2>
      </section>

      <AnimatePresence>
        {attentionItems.length > 0 && (
          <section className="mb-8">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">
              {t.home.needsAttention}
            </p>
            <div className="space-y-4">
              {attentionItems.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id} 
                  className="bg-white p-5 rounded-[2rem] border border-[#E8E5E0] shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-[#2D4F3C]">{item.title}</h3>
                      <p className="text-2xl font-bold text-[#2D4F3C] mt-1">
                        {formatCurrency(item.amount, item.currency)}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      item.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {item.status === 'overdue' ? <AlertCircle size={12} /> : <Clock size={12} />}
                      {item.status === 'overdue' ? t.home.overdue : 'URGENT'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#706F6C] mb-6">
                    <Calendar size={14} />
                    <span>Due {new Date(item.dueDate!).toLocaleDateString(state.user.language)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setReminderItem(item);
                      }}
                      className="py-3 px-4 bg-[#F3F1EE] text-[#2D4F3C] rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Bell size={14} />
                      {t.common.remindMe}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'UPDATE_ITEM', payload: { ...item, status: 'handled' }});
                      }}
                      className="py-3 px-4 bg-[#2D4F3C] text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} />
                      {t.common.markHandled}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </AnimatePresence>

      <section className="mb-8">
        <div className="bg-[#2D4F3C] p-6 rounded-[2.5rem] text-white shadow-xl shadow-[#2D4F3C]/20">
          <p className="text-[10px] font-bold tracking-[0.2em] opacity-60 mb-2 uppercase">
            {t.home.safeToSpend}
          </p>
          <h2 className="text-4xl font-bold mb-2">
            {formatCurrency(safeToSpend, state.user.currency)}
          </h2>
          <p className="text-xs opacity-80 leading-relaxed mb-6">
            {t.home.safeToSpendDesc}
          </p>
          <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
            {t.home.viewMoney}
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">
          {t.home.aiNoticed}
        </p>
        <div className="space-y-3">
          {state.items.filter(i => i.status !== 'handled').slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 bg-[#F3F1EE] rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-[#2D4F3C]" size={20} />
              </div>
              <p className="text-sm text-[#2D4F3C] leading-snug">
                "Your {item.provider} {item.type} is due in {Math.max(0, Math.ceil((new Date(item.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days."
              </p>
            </div>
          ))}
          {state.items.filter(i => i.status !== 'handled').length === 0 && (
            <div className="flex items-start gap-4 p-4 bg-[#F3F1EE] rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="text-[#2D4F3C]" size={20} />
              </div>
              <p className="text-sm text-[#2D4F3C] leading-snug">
                "Everything looks organized! You have no urgent bills to handle."
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <BillDetailModal 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)} 
          item={selectedItem} 
        />
      )}

      {reminderItem && (
        <ReminderModal
          isOpen={!!reminderItem}
          onClose={() => setReminderItem(null)}
          item={reminderItem}
        />
      )}
    </div>
  );
};
