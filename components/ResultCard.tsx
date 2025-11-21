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
  const [loading, setLoading] = useState(false);

  // Debounced Auto-Fetch
  useEffect(() => {
    let isMounted = true;
    
    // Clear previous insight if amount changes drastically or currency changes
    setInsight(null); 
    
    const timer = setTimeout(async () => {
      if (!isMounted) return;

      setLoading(true);
      try {
        const text = await getPurchasingPowerInsight(country.name, Math.floor(localAmount), currency.code);
        if (isMounted) setInsight(text);
      } catch (e) {
        // Fail silently for UI cleanliness
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 1500); // Wait 1.5s after typing stops before calling AI

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [country.name, currency.code, localAmount]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-gold-300 transition-all duration-300 flex flex-col overflow-hidden">
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div>
             <h3 className="text-base font-bold text-slate-800 leading-tight">{country.name}</h3>
             <p className="text-xs text-slate-500 mt-0.5">{currency.name}</p>
          </div>
          <span className="text-3xl leading-none filter drop-shadow-sm">{country.flagEmoji}</span>
        </div>
        
        <div className="mt-2 mb-4">
          <p className="text-2xl font-serif font-bold text-gold-600 tracking-tight truncate" title={localAmount.toLocaleString()}>
            {currency.symbol}{localAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="flex items-center gap-2 mt-1">
             <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
               {currency.code}
             </span>
             {localAmount >= 1000000000 ? (
               <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Billionaire</span>
             ) : (
               <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Millionaire</span>
             )}
          </div>
        </div>

        <div className="min-h-[3.5rem] relative">
          {loading ? (
            <div className="space-y-1.5 animate-pulse pt-1">
               <div className="h-2 bg-slate-100 rounded w-3/4"></div>
               <div className="h-2 bg-slate-100 rounded w-full"></div>
            </div>
          ) : insight ? (
            <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-gold-300 pl-2 italic animate-in fade-in duration-500">
              {insight}
            </p>
          ) : (
            <p className="text-xs text-slate-300 italic">Analyzing purchasing power...</p>
          )}
        </div>
      </div>
    </div>
  );
};