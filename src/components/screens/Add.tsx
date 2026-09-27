import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../translations';
import { analyzeInput } from '../../services/ai';
import { 
  Type, 
  Camera, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Calendar,
  Tag,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/currency';
import { AppItem } from '../../types';

interface AddProps {
  onComplete: () => void;
}

export const Add: React.FC<AddProps> = ({ onComplete }) => {
  const { state, dispatch } = useApp();
  const t = translations[state.user.language];
  
  const [mode, setMode] = useState<'select' | 'text' | 'voice' | 'camera'>('select');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<AppItem> | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeInput(inputText, state.user.currency);
      setExtractedData(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!extractedData) return;
    
    const newItem: AppItem = {
      ...extractedData as AppItem,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    onComplete();
  };

  if (mode === 'select') {
    return (
      <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-[#2D4F3C] mb-2">{t.add.title}</h1>
          <p className="text-[#A3A3A3]">{t.add.subtitle}</p>
        </header>

        <div className="space-y-4">
          {[
            { id: 'text', name: t.add.text, icon: Type, color: 'bg-[#9E7FFF]' },
            { id: 'camera', name: t.add.scan, icon: Camera, color: 'bg-[#38bdf8]' },
            { id: 'voice', name: t.add.voice, icon: Mic, color: 'bg-[#f472b6]' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id as any)}
              className="w-full p-6 bg-white border border-[#E8E5E0] rounded-[2.5rem] flex items-center gap-6 hover:border-[#2D4F3C] transition-all group"
            >
              <div className={`w-14 h-14 ${item.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <div className="text-left">
                <p className="text-lg font-bold text-[#2D4F3C]">{item.name}</p>
                <p className="text-sm text-[#A3A3A3]">AI-powered extraction</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-12 px-6 max-w-md mx-auto">
      <header className="mb-8 flex items-center justify-between">
        <button onClick={() => setMode('select')} className="text-sm font-bold text-[#A3A3A3]">
          {t.common.cancel}
        </button>
        <h1 className="text-xl font-bold text-[#2D4F3C]">{t.add.text}</h1>
        <div className="w-10" />
      </header>

      <div className="space-y-6">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your invoice text or type details here..."
            className="w-full h-48 p-6 bg-white border border-[#E8E5E0] rounded-[2.5rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2D4F3C]/10 text-sm resize-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="absolute bottom-4 right-4 p-4 bg-[#2D4F3C] text-white rounded-2xl shadow-lg disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {extractedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2.5rem] border border-[#E8E5E0] shadow-sm space-y-6"
            >
              <div className="flex items-center gap-2 text-[#2D4F3C]">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Extracted Details</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F3F1EE] rounded-xl flex items-center justify-center">
                      <Wallet size={18} className="text-[#2D4F3C]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A3A3A3] uppercase">Amount</p>
                      <p className="font-bold text-[#2D4F3C]">
                        {formatCurrency(extractedData.amount || 0, extractedData.currency || state.user.currency)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F3F1EE] rounded-xl flex items-center justify-center">
                      <Calendar size={18} className="text-[#2D4F3C]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A3A3A3] uppercase">Due Date</p>
                      <p className="font-bold text-[#2D4F3C]">
                        {extractedData.dueDate || 'Not detected'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F3F1EE] rounded-xl flex items-center justify-center">
                      <Tag size={18} className="text-[#2D4F3C]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#A3A3A3] uppercase">Provider</p>
                      <p className="font-bold text-[#2D4F3C]">{extractedData.provider}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 bg-[#2D4F3C] text-white rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                Confirm & Save
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
