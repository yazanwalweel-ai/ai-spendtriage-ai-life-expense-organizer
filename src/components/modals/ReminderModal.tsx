import React, { useState } from 'react';
import { X, Bell, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppItem, Reminder } from '../../types';
import { translations } from '../../translations';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AppItem;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, item }) => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  
  const [type, setType] = useState<Reminder['type']>(item.reminder?.type || '1_day_before');
  const [time, setTime] = useState(item.reminder?.time || '09:00');

  if (!isOpen) return null;

  const handleSave = () => {
    const reminder: Reminder = {
      id: item.reminder?.id || Math.random().toString(36).substr(2, 9),
      itemId: item.id,
      date: item.dueDate || new Date().toISOString().split('T')[0],
      time,
      type,
      status: 'pending'
    };

    dispatch({ type: 'SET_REMINDER', payload: { itemId: item.id, reminder } });
    
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-[#F3F1EE] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2D4F3C]">{t.common.remindMe}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F3F1EE] rounded-full transition-colors">
            <X size={20} className="text-[#A3A3A3]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-3 block">When to remind</label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'on_due_date', label: 'On due date' },
                { id: '1_day_before', label: '1 day before' },
                { id: '3_days_before', label: '3 days before' },
                { id: '7_days_before', label: '7 days before' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setType(opt.id as Reminder['type'])}
                  className={`p-4 rounded-2xl text-left text-sm font-medium transition-all ${
                    type === opt.id 
                      ? 'bg-[#2D4F3C] text-white shadow-lg shadow-[#2D4F3C]/20' 
                      : 'bg-[#F3F1EE] text-[#2D4F3C] hover:bg-[#E8E5E0]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-3 block">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-lg font-bold text-[#2D4F3C] focus:outline-none"
            />
          </div>
        </div>

        <div className="p-6 bg-[#F3F1EE]/50">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-[#2D4F3C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2D4F3C]/20"
          >
            <Bell size={20} />
            {t.common.save}
          </button>
        </div>
      </div>
    </div>
  );
};
