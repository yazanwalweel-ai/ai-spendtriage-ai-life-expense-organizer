import { en } from './en';
import { ar } from './ar';
import { tr } from './tr';
import { ru } from './ru';
import { fr } from './fr';
import { de } from './de';
import { Language } from '../types';

export const translations: Record<Language, any> = { en, ar, tr, ru, fr, de };

export const getDirection = (lang: Language): 'ltr' | 'rtl' => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};
