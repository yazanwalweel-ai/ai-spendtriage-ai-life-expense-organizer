import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { Button } from '../ui/Button';
import { Language, Currency } from '../../types';
import { Check, Globe, Wallet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Onboarding: React.FC = () => {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(1);
  const t = translations[state.user.language];

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'ILS', 'JOD', 'TRY', 'INR', 'AED', 'SAR', 'CAD', 'AUD'];

  const handleLanguageSelect = (lang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const handleCurrencySelect = (curr: Currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: curr });
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 bg-[#FDFCFB] z-[100] flex flex-col p-6 overflow-y-auto">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full"
          >
            <div className="mt-12 mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[#2D4F3C] mb-2">
                {t.onboarding.welcome}
              </h1>
              <p className="text-[#706F6C]">{t.onboarding.chooseLanguage}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                    state.user.language === lang.code 
                      ? "border-[#2D4F3C] bg-[#2D4F3C]/5" 
                      : "border-[#E8E5E0] bg-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-[#2D4F3C]">{lang.name}</span>
                  </div>
                  {state.user.language === lang.code && <Check size={20} className="text-[#2D4F3C]" />}
                </button>
              ))}
            </div>

            <Button onClick={nextStep} className="mt-auto">
              {t.common.continue}
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full"
          >
            <div className="mt-12 mb-8 text-center">
              <div className="w-16 h-16 bg-[#2D4F3C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-[#2D4F3C]" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#2D4F3C] mb-2">{t.onboarding.chooseCurrency}</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => handleCurrencySelect(curr)}
                  className={clsx(
                    "p-4 rounded-2xl border-2 transition-all text-center font-bold",
                    state.user.currency === curr 
                      ? "border-[#2D4F3C] bg-[#2D4F3C]/5 text-[#2D4F3C]" 
                      : "border-[#E8E5E0] bg-white text-[#706F6C]"
                  )}
                >
                  {curr}
                </button>
              ))}
            </div>

            <Button onClick={nextStep} className="mt-auto">
              {t.common.continue}
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full"
          >
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-bold text-[#2D4F3C] mb-2">{t.onboarding.financials}</h2>
              <p className="text-[#706F6C]">Help us calculate your safe-to-spend amount.</p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-[#706F6C] mb-2">{t.onboarding.incomeLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-4 rounded-2xl border-2 border-[#E8E5E0] focus:border-[#2D4F3C] outline-none transition-colors"
                  placeholder="0.00"
                  onChange={(e) => dispatch({ type: 'SET_USER', payload: { monthlyIncome: Number(e.target.value) }})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#706F6C] mb-2">{t.onboarding.billsLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-4 rounded-2xl border-2 border-[#E8E5E0] focus:border-[#2D4F3C] outline-none transition-colors"
                  placeholder="0.00"
                  onChange={(e) => dispatch({ type: 'SET_USER', payload: { fixedBills: Number(e.target.value) }})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#706F6C] mb-2">{t.onboarding.rentLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-4 rounded-2xl border-2 border-[#E8E5E0] focus:border-[#2D4F3C] outline-none transition-colors"
                  placeholder="0.00"
                  onChange={(e) => dispatch({ type: 'SET_USER', payload: { rent: Number(e.target.value) }})}
                />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button onClick={nextStep}>{t.common.continue}</Button>
              <Button variant="ghost" onClick={nextStep}>{t.common.skip}</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col max-w-md mx-auto w-full text-center"
          >
            <div className="mt-20 mb-12">
              <div className="w-24 h-24 bg-[#2D4F3C] rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12 shadow-xl shadow-[#2D4F3C]/20">
                <Sparkles className="text-white" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[#2D4F3C] mb-4">{t.onboarding.trialTitle}</h2>
              <p className="text-lg text-[#706F6C] px-4">{t.onboarding.trialDesc}</p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button size="lg" onClick={() => {
                dispatch({ type: 'START_TRIAL' });
                dispatch({ type: 'COMPLETE_ONBOARDING' });
              }}>
                {t.onboarding.startTrial}
              </Button>
              <Button variant="ghost" onClick={() => dispatch({ type: 'COMPLETE_ONBOARDING' })}>
                {t.common.maybeLater}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { clsx } from 'clsx';
