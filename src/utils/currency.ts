import { Currency } from '../types';

const currencyLocales: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  ILS: 'he-IL',
  JOD: 'ar-JO',
  TRY: 'tr-TR',
  INR: 'en-IN',
  AED: 'ar-AE',
  SAR: 'ar-SA',
  CAD: 'en-CA',
  AUD: 'en-AU'
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
