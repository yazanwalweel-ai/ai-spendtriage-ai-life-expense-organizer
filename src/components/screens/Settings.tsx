import React from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { User, Globe, Wallet, Bell, Shield, Mail, Info, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { Language, Currency } from '../../types';

export const Settings: React.FC = () => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ru', name: 'Русский' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ];

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'ILS', 'JOD', 'TRY', 'INR', 'AED', 'SAR', 'CAD', 'AUD'];

  const daysRemaining = state.user.trialEndDate 
    ? Math.max(0, Math.ceil((new Date(state.user.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-[#2D4F3C] mb-8">{t.common.settings}</h1>

      <section className="mb-8">
        <div className="flex items-center gap-4 p-4 bg-white rounded-[2rem] border border-[#E8E5E0] mb-4">
          <div className="w-16 h-16 bg-[#2D4F3C]/5 rounded-full flex items-center justify-center text-[#2D4F3C]">
            <User size={32} />
          </div>
          <div>
            <h2 className="font-bold text-lg">{state.user.name}</h2>
            <p className="text-[#A3A3A3] text-sm">Pro Member</p>
          </div>
        </div>

        <div className="bg-[#2D4F3C] p-6 rounded-[2rem] text-white shadow-lg shadow-[#2D4F3C]/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-70">
              {t.settings.subscription}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">AI SpendTriage Pro</h3>
          <p className="text-sm opacity-80 mb-4">
            {daysRemaining > 0 
              ? t.settings.trialDaysLeft.replace('{days}', daysRemaining.toString())
              : t.settings.trialEnded}
          </p>
          <button className="w-full py-3 bg-white text-[#2D4F3C] rounded-xl text-sm font-bold">
            {daysRemaining > 0 ? 'Manage Subscription' : t.settings.subscribe}
          </button>
        </div>
      </section>

      <div className="space-y-8">
        <section>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">
            {t.settings.preferences}
          </p>
          <div className="bg-white rounded-[2rem] border border-[#E8E5E0] overflow-hidden">
            <div className="p-4 border-b border-[#E8E5E0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-[#706F6C]" />
                <span className="font-medium">{t.settings.language}</span>
              </div>
              <select 
                value={state.user.language}
                onChange={(e) => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as Language })}
                className="bg-transparent font-bold text-[#2D4F3C] outline-none"
              >
                {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div className="p-4 border-b border-[#E8E5E0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet size={20} className="text-[#706F6C]" />
                <span className="font-medium">{t.settings.currency}</span>
              </div>
              <select 
                value={state.user.currency}
                onChange={(e) => dispatch({ type: 'SET_CURRENCY', payload: e.target.value as Currency })}
                className="bg-transparent font-bold text-[#2D4F3C] outline-none"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-[#706F6C]" />
                <span className="font-medium">{t.settings.notifications}</span>
              </div>
              <ChevronRight size={16} className="text-[#A3A3A3]" />
            </button>
          </div>
        </section>

        <section>
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] mb-4 uppercase">
            {t.settings.support}
          </p>
          <div className="bg-white rounded-[2rem] border border-[#E8E5E0] overflow-hidden">
            <a 
              href="mailto:support@st7r6.onmicrosoft.com?subject=AI SpendTriage Support Request"
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-[#706F6C]" />
                <span className="font-medium">Email Support</span>
              </div>
              <ChevronRight size={16} className="text-[#A3A3A3]" />
            </a>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[#706F6C]" />
                <span className="font-medium">{t.settings.privacy}</span>
              </div>
              <ChevronRight size={16} className="text-[#A3A3A3]" />
            </button>
          </div>
        </section>

        <button 
          onClick={() => {
            if(confirm('Are you sure? This will delete all your data.')) {
              dispatch({ type: 'RESET_APP' });
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full p-6 bg-red-50 text-red-600 rounded-[2rem] font-bold flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          {t.settings.reset}
        </button>
      </div>
    </div>
  );
};
