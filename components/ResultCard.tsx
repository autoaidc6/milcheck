import React, { useState, useEffect } from 'react';
import { Country, Currency } from '../types';
import { getPurchasingPowerInsight } from '../services/geminiService';

interface ResultCardProps {
  country: Country;
  currency: Currency;
  localAmount: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ country, currency, localAmount }) => {
  const [insight, setInsight] = useState<string | null>(null);
  
  // Debounced Auto-Fetch
  useEffect(() => {
    let isMounted = true;
    setInsight(null); 
    
    const timer = setTimeout(async () => {
      if (!isMounted) return;
      try {
        const text = await getPurchasingPowerInsight(country.name, Math.floor(localAmount), currency.code);
        if (isMounted) setInsight(text);
      } catch (e) {
        // Fail silently
      }
    }, 1000); // Reduced to 1s for snappier feel

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [country.name, currency.code, localAmount]);

  return (
    <div className="group bg-white rounded-lg border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 hover:border-gold-400 transition-all shadow-sm hover:shadow-md">
      {/* Left: Flag & Name */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <span className="text-3xl select-none">{country.flagEmoji}</span>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 leading-tight">{country.name}</h3>
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">{currency.name}</span>
        </div>
      </div>

      {/* Middle: AI Insight (Flexible width) */}
      <div className="flex-grow min-h-[1.25rem] flex items-center">
         {insight ? (
            <p className="text-xs text-slate-600 italic border-l-2 border-gold-300 pl-2 animate-in fade-in slide-in-from-left-2 duration-500">
              {insight}
            </p>
         ) : (
            // Placeholder to prevent layout jump, or empty if preferred. 
            // Keeping it minimal:
            <div className="hidden sm:block h-0.5 w-12 bg-slate-100 rounded"></div>
         )}
      </div>

      {/* Right: Amount & Badge */}
      <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[200px]">
        <div className="text-right">
          <p className="text-lg font-serif font-bold text-gold-600 leading-none" title={localAmount.toLocaleString()}>
            {currency.symbol}{localAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5 text-right">
            {currency.code}
          </p>
        </div>
        
        <div className="flex-shrink-0">
           {localAmount >= 1000000000 ? (
               <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Billionaire</span>
             ) : (
               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Millionaire</span>
             )}
        </div>
      </div>
    </div>
  );
};