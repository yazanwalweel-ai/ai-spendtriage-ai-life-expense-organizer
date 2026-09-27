import React, { useState } from 'react';
import { X, Calendar, Bell, CheckCircle2, Trash2, Edit3, Save, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppItem, Currency } from '../../types';
import { translations } from '../../translations';
import { formatDate, calculateItemStatus } from '../../utils/date';
import { formatCurrency } from '../../utils/currency';

interface BillDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AppItem;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({ isOpen, onClose, item }) => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<AppItem>({ ...item });

  if (!isOpen) return null;

  const handleSave = () => {
    const updatedItem = {
      ...editData,
      status: calculateItemStatus(editData.dueDate, editData.status)
    };
    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
    setIsEditing(false);
  };

  const handleMarkHandled = () => {
    dispatch({ type: 'UPDATE_ITEM', payload: { ...item, status: 'handled' } });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch({ type: 'DELETE_ITEM', payload: item.id });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-[#F3F1EE] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#2D4F3C]">
            {isEditing ? t.common.edit : item.title}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F3F1EE] rounded-full transition-colors">
            <X size={20} className="text-[#A3A3A3]" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Provider</label>
                <input
                  type="text"
                  value={editData.provider}
                  onChange={e => setEditData({ ...editData, provider: e.target.value })}
                  className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Amount</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={e => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                    className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Due Date</label>
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={e => setEditData({ ...editData, dueDate: e.target.value })}
                    className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-1 block">Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={e => setEditData({ ...editData, notes: e.target.value })}
                  className="w-full p-4 bg-[#F3F1EE] rounded-2xl text-sm font-medium text-[#2D4F3C] focus:outline-none h-24 resize-none"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-4xl font-bold text-[#2D4F3C]">
                    {formatCurrency(item.amount, item.currency)}
                  </p>
                  <p className="text-sm text-[#A3A3A3] mt-1">{item.provider}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  item.status === 'overdue' ? 'bg-red-50 text-red-600' : 
                  item.status === 'handled' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.status === 'overdue' && <AlertCircle size={12} />}
                  {item.status.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F3F1EE] rounded-2xl">
                  <div className="flex items-center gap-2 text-[#A3A3A3] mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase">Due Date</span>
                  </div>
                  <p className="text-sm font-bold text-[#2D4F3C]">
                    {item.dueDate ? formatDate(item.dueDate, state.user.language) : 'No date'}
                  </p>
                </div>
                <div className="p-4 bg-[#F3F1EE] rounded-2xl">
                  <div className="flex items-center gap-2 text-[#A3A3A3] mb-1">
                    <Bell size={14} />
                    <span className="text-[10px] font-bold uppercase">Reminder</span>
                  </div>
                  <p className="text-sm font-bold text-[#2D4F3C]">
                    {item.reminder ? `${item.reminder.type.replace(/_/g, ' ')}` : 'None set'}
                  </p>
                </div>
              </div>

              {item.summary && (
                <div className="p-4 bg-[#2D4F3C]/5 rounded-2xl border border-[#2D4F3C]/10">
                  <p className="text-[10px] font-bold text-[#2D4F3C] uppercase mb-2">AI Summary</p>
                  <p className="text-sm text-[#2D4F3C]/80 leading-relaxed">{item.summary}</p>
                </div>
              )}

              {item.notes && (
                <div>
                  <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mb-2">Notes</p>
                  <p className="text-sm text-[#706F6C]">{item.notes}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 bg-[#F3F1EE]/50 grid grid-cols-2 gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="py-4 bg-white border border-[#E8E5E0] text-[#2D4F3C] rounded-2xl font-bold"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSave}
                className="py-4 bg-[#2D4F3C] text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {t.common.save}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="py-4 bg-white border border-[#E8E5E0] text-[#2D4F3C] rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Edit3 size={18} />
                {t.common.edit}
              </button>
              <button
                onClick={handleMarkHandled}
                disabled={item.status === 'handled'}
                className="py-4 bg-[#2D4F3C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 size={18} />
                {t.common.markHandled}
              </button>
              <button
                onClick={handleDelete}
                className="col-span-2 py-4 text-red-500 font-bold flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                {t.common.delete}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
