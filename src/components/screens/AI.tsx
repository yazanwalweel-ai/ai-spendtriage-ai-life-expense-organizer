import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { 
  Search, 
  FileText, 
  TrendingDown, 
  Radar, 
  Calendar, 
  HelpCircle, 
  CheckSquare, 
  RefreshCw, 
  MessageSquare,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '../../services/ai';

export const AI: React.FC = () => {
  const { state } = useApp();
  const t = translations[state.user.language];
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleToolClick = async (toolName: string) => {
    setIsAnalyzing(true);
    setResponse(null);
    
    // Simulate tool-specific analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let result = "";
    switch(toolName) {
      case 'Document Analyzer':
        result = `I've analyzed your ${state.items.length} documents. Most are utilities and subscriptions.`;
        break;
      case 'Spending Coach':
        const total = state.expenses.reduce((a, b) => a + b.amount, 0);
        result = `You've spent ${total} ${state.user.currency}. I recommend reducing your 'general' category spending by 10%.`;
        break;
      case 'Subscription Radar':
        const subs = state.items.filter(i => i.recurring);
        result = `You have ${subs.length} active subscriptions totaling ${subs.reduce((a, b) => a + b.amount, 0)} ${state.user.currency}/mo.`;
        break;
      case 'Deadline Finder':
        const upcoming = state.items.filter(i => i.status !== 'handled');
        result = upcoming.length > 0 
          ? `Your next deadline is ${upcoming[0].title} on ${upcoming[0].dueDate}.`
          : "No upcoming deadlines found.";
        break;
      default:
        result = "Analysis complete. Everything looks in order.";
    }
    
    setResponse(result);
    setIsAnalyzing(false);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    const res = await getAIResponse(query, {
      items: state.items,
      expenses: state.expenses,
      userCurrency: state.user.currency
    });
    setResponse(res);
    setIsAnalyzing(false);
    setQuery('');
  };

  const tools = [
    { id: 'doc', name: 'Document Analyzer', icon: FileText, color: 'bg-blue-500' },
    { id: 'coach', name: 'Spending Coach', icon: TrendingDown, color: 'bg-green-500' },
    { id: 'radar', name: 'Subscription Radar', icon: Radar, color: 'bg-purple-500' },
    { id: 'dead', name: 'Deadline Finder', icon: Calendar, color: 'bg-orange-500' },
    { id: 'exp', name: 'Explain This', icon: HelpCircle, color: 'bg-pink-500' },
    { id: 'bill', name: 'Bill Check', icon: CheckSquare, color: 'bg-indigo-500' },
    { id: 'renew', name: 'Renewal Watch', icon: RefreshCw, color: 'bg-cyan-500' },
    { id: 'ask', name: 'Ask SpendTriage', icon: MessageSquare, color: 'bg-[#2D4F3C]' },
  ];

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#2D4F3C] mb-2">{t.ai.title}</h1>
        <p className="text-[#A3A3A3]">{t.ai.subtitle}</p>
      </header>

      <form onSubmit={handleAsk} className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.ai.placeholder}
          className="w-full p-5 pr-14 bg-white border border-[#E8E5E0] rounded-[2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F3C]/10 text-sm"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#2D4F3C] text-white rounded-full flex items-center justify-center"
        >
          <ArrowRight size={20} />
        </button>
      </form>

      <AnimatePresence>
        {(isAnalyzing || response) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-8 p-6 bg-[#2D4F3C] text-white rounded-[2.5rem] shadow-xl shadow-[#2D4F3C]/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-yellow-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase">AI Insight</span>
            </div>
            {isAnalyzing ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{response}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.name)}
            className="p-5 bg-white border border-[#E8E5E0] rounded-[2rem] text-left hover:border-[#2D4F3C] transition-all group"
          >
            <div className={`w-10 h-10 ${tool.color} text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon size={20} />
            </div>
            <p className="text-[10px] font-bold text-[#2D4F3C] uppercase leading-tight">
              {tool.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
