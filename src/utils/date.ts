import { Language, ItemStatus } from '../types';

export const formatDate = (dateString: string, lang: Language): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const calculateItemStatus = (dueDate: string | undefined, currentStatus: ItemStatus): ItemStatus => {
  if (currentStatus === 'handled') return 'handled';
  if (!dueDate) return 'pending';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'due_today';
  return 'upcoming';
};

export const getDaysUntil = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
