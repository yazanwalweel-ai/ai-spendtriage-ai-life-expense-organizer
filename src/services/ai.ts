import { AppItem, Currency, Expense } from '../types';

interface AIContext {
  items: AppItem[];
  expenses: Expense[];
  userCurrency: Currency;
}

export const parseAIDate = (text: string): string | null => {
  // Robust regex for various date formats
  const datePatterns = [
    // ISO: 2026-10-14
    /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
    // US: 10/14/2026 or 10-14-2026
    /(\d{1,2})[-/](\d{1,2})[-/](\d{4})/,
    // Textual: October 14, 2026 or 14 October 2026
    /(\d{1,2})?\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*(\d{1,2})?,?\s*(\d{4})/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Handle textual dates
        if (isNaN(Number(match[1])) || match[2].length > 2) {
          const monthStr = match[2] || match[3];
          const day = match[1] || match[3];
          const year = match[4];
          const date = new Date(`${monthStr} ${day}, ${year}`);
          if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
        }
        
        // Handle numeric dates (detecting DD/MM vs MM/DD based on values)
        let year, month, day;
        if (match[1].length === 4) { // YYYY-MM-DD
          [year, month, day] = [match[1], match[2], match[3]];
        } else { // DD/MM/YYYY or MM/DD/YYYY
          const v1 = parseInt(match[1]);
          const v2 = parseInt(match[2]);
          year = match[3];
          if (v1 > 12) { [day, month] = [v1, v2]; }
          else { [month, day] = [v1, v2]; }
        }
        
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
      } catch (e) {
        continue;
      }
    }
  }
  return null;
};

export const analyzeInput = async (
  input: string,
  currency: Currency,
  context?: AIContext
): Promise<Partial<AppItem>> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const text = input.toLowerCase();
  
  // Extract Amount
  const amountMatch = text.match(/(?:€|\$|£|usd|eur|gbp)\s*(\d+(?:[.,]\d{1,2})?)|(\d+(?:[.,]\d{1,2})?)\s*(?:€|\$|£|usd|eur|gbp|ils|jod|try|aed|sar)/i);
  const amount = amountMatch ? parseFloat((amountMatch[1] || amountMatch[2]).replace(',', '.')) : 0;

  // Extract Date
  const dueDate = parseAIDate(input);

  // Extract Provider/Title
  let provider = "Unknown Provider";
  const providers = ['vodafone', 'orange', 'netflix', 'spotify', 'amazon', 'apple', 'google', 'electricity', 'energy', 'water', 'insurance', 'rent'];
  for (const p of providers) {
    if (text.includes(p)) {
      provider = p.charAt(0).toUpperCase() + p.slice(1);
      break;
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    title: provider.toUpperCase(),
    provider,
    amount,
    currency,
    dueDate: dueDate || undefined,
    type: text.includes('receipt') ? 'receipt' : 'bill',
    category: text.includes('utility') || text.includes('electricity') ? 'utilities' : 'general',
    recurring: text.includes('monthly') || text.includes('subscription'),
    actionRequired: true,
    priority: amount > 100 ? 'high' : 'medium',
    status: 'pending',
    source: 'text',
    summary: `AI extracted ${provider} for ${amount} ${currency} due on ${dueDate || 'unknown date'}.`,
    createdAt: new Date().toISOString()
  };
};

export const getAIResponse = async (query: string, context: AIContext): Promise<string> => {
  const q = query.toLowerCase();
  
  if (q.includes('bill') || q.includes('upcoming')) {
    const upcoming = context.items.filter(i => i.status !== 'handled');
    if (upcoming.length === 0) return "You have no upcoming bills at the moment.";
    return `You have ${upcoming.length} upcoming bills totaling ${upcoming.reduce((a, b) => a + b.amount, 0)} ${context.userCurrency}. The next one is ${upcoming[0].title} due on ${upcoming[0].dueDate}.`;
  }

  if (q.includes('spend') || q.includes('spent')) {
    const totalSpent = context.expenses.reduce((a, b) => a + b.amount, 0);
    return `You have spent a total of ${totalSpent} ${context.userCurrency} this month across ${context.expenses.length} transactions.`;
  }

  return "I've analyzed your data. How else can I help you manage your finances today?";
};
