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
    
    // Clear previous insight immediately when props change to avoid stale data
    setInsight(null);

    const timer = setTimeout(async () => {
      if (!isMounted) return;
      try {
        const text = await getPurchasingPowerInsight(country.name, Math.floor(localAmount), currency.code);
        if (isMounted) setInsight(text);
      } catch (e) {
        // Fail silently
      }
    }, 800); 

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [country.name, currency.code, localAmount]);

  return (
    <div className="group relative bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4 overflow-hidden">
      {/* Left Side: Flag and Text Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="flex-shrink-0 text-3xl sm:text-4xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-full shadow-inner select-none">
          {country.flagEmoji}
        </div>
        
        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base font-bold text-slate-900 truncate">{country.name}</h3>
            <span className="hidden sm:inline-block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currency.name}</span>
          </div>
          
          {/* Fixed height container for insight to prevent layout jumps */}
          <div className="h-4 mt-0.5 flex items-center">
            {insight ? (
              <p className="text-xs text-gold-600 font-medium truncate italic animate-in fade-in slide-in-from-left-1 duration-300">
                "{insight}"
              </p>
            ) : (
              <div className="h-1.5 w-24 bg-slate-100 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Amount */}
      <div className="text-right flex-shrink-0 pl-2">
        <div className="text-lg sm:text-xl font-serif font-bold text-slate-800 group-hover:text-gold-600 transition-colors">
          {currency.symbol}{localAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
        <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
          {currency.code}
        </div>
      </div>
      
      {/* Subtle Gold decorative bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-xl" />
    </div>
  );
};