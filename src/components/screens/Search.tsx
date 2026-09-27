import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Search as SearchIcon, Filter, Calendar, CreditCard, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export const Search: React.FC = () => {
  const { state } = useApp();
  const t = translations[state.user.language];
  const [query, setQuery] = useState('');

  const filteredItems = state.items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3]" size={20} />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bills, receipts, docs..."
            className="w-full p-4 pl-12 rounded-2xl border border-[#E8E5E0] focus:border-[#2D4F3C] outline-none"
          />
        </div>
        <button className="p-4 bg-white border border-[#E8E5E0] rounded-2xl text-[#2D4F3C]">
          <Filter size={20} />
        </button>
      </div>

      {query ? (
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="p-4 bg-white rounded-2xl border border-[#E8E5E0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F3F1EE] rounded-xl flex items-center justify-center text-[#2D4F3C]">
                    {item.type === 'bill' ? <CreditCard size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-[#2D4F3C]">{item.title}</p>
                    <p className="text-[10px] text-[#A3A3A3] uppercase">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="font-bold text-[#2D4F3C]">
                  {formatCurrency(item.amount, item.currency)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-[#A3A3A3]">No results found for "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Electricity bill', 'Netflix', 'Insurance', 'Rent'].map(s => (
                <button key={s} onClick={() => setQuery(s)} className="px-4 py-2 bg-[#F3F1EE] rounded-full text-sm text-[#2D4F3C] font-medium">
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">Browse by Category</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Bills', icon: CreditCard },
                { label: 'Documents', icon: FileText },
                { label: 'Subscriptions', icon: Calendar },
                { label: 'Receipts', icon: SearchIcon },
              ].map(cat => (
                <button key={cat.label} className="p-4 bg-white border border-[#E8E5E0] rounded-2xl flex items-center gap-3">
                  <cat.icon size={18} className="text-[#2D4F3C]" />
                  <span className="font-bold text-sm text-[#2D4F3C]">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
