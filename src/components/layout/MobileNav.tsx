import React from 'react';
import { Home, Plus, Wallet, Sparkles, Search, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const { state } = useApp();
  const t = translations[state.user.language].common;

  const tabs = [
    { id: 'home', icon: Home, label: t.home },
    { id: 'money', icon: Wallet, label: t.money },
    { id: 'add', icon: Plus, label: t.add, primary: true },
    { id: 'ai', icon: Sparkles, label: t.ai },
    { id: 'search', icon: Search, label: t.search },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#E8E5E0] px-4 pb-8 pt-2 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              "flex flex-col items-center gap-1 transition-colors",
              tab.primary ? "relative -top-4" : "",
              activeTab === tab.id ? "text-[#2D4F3C]" : "text-[#A3A3A3]"
            )}
          >
            {tab.primary ? (
              <div className="w-14 h-14 bg-[#2D4F3C] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#2D4F3C]/20 active:scale-90 transition-transform">
                <tab.icon size={28} />
              </div>
            ) : (
              <>
                <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

import { clsx } from 'clsx';
