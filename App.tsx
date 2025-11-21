import React, { useState, useMemo } from 'react';
import { COUNTRIES, CURRENCIES } from './constants';
import { ResultCard } from './components/ResultCard';
import { MillionaireResult } from './types';

function App() {
  // Default to USD
  const [baseCurrencyCode, setBaseCurrencyCode] = useState<string>('USD');
  const [amount, setAmount] = useState<string>('10000');

  // Memoize logic to keep it instant
  const results: MillionaireResult[] = useMemo(() => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return [];
    }

    // 1. Find base currency rate to USD
    const baseCurrency = CURRENCIES.find(c => c.code === baseCurrencyCode);
    if (!baseCurrency) return [];

    // 2. Convert user amount to USD
    const usdAmount = numericAmount / baseCurrency.rateToUSD;

    // 3. Calculate for each country
    const eligibleResults: MillionaireResult[] = [];

    COUNTRIES.forEach(country => {
      const localCurrency = CURRENCIES.find(c => c.code === country.currencyCode);
      if (localCurrency) {
        // Convert USD Amount to Local
        const localVal = usdAmount * localCurrency.rateToUSD;
        
        if (localVal >= 1000000) {
          eligibleResults.push({
            country,
            currency: localCurrency,
            localAmount: localVal
          });
        }
      }
    });

    // Sort by highest amount
    return eligibleResults.sort((a, b) => b.localAmount - a.localAmount);
  }, [amount, baseCurrencyCode]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Compact Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            
            {/* Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm flex-shrink-0">
              M
            </div>

            {/* Inputs - Flex to fill space */}
            <div className="flex flex-grow items-center gap-2">
              {/* Amount Input */}
              <div className="relative flex-grow">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 pl-3 pr-2 bg-slate-100 focus:bg-white rounded-lg border-0 ring-1 ring-slate-200 focus:ring-2 focus:ring-gold-400 text-base font-bold text-slate-900 placeholder-slate-400 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] font-bold text-slate-400 uppercase">
                  Amount
                </div>
              </div>

              {/* Currency Select */}
              <div className="relative w-24 sm:w-28 flex-shrink-0">
                <select
                  id="currency"
                  value={baseCurrencyCode}
                  onChange={(e) => setBaseCurrencyCode(e.target.value)}
                  className="w-full h-10 pl-2 pr-6 bg-slate-100 hover:bg-slate-200 rounded-lg border-0 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-gold-400 cursor-pointer transition-colors appearance-none"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-6">
        
        {/* Results Count */}
        <div className="mb-3 px-1 flex items-center justify-between">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
             {results.length > 0 ? 'Your Kingdom' : 'Results'}
           </p>
           {results.length > 0 && (
             <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
               {results.length} Countries
             </span>
           )}
        </div>

        {/* List of Cards */}
        <div className="flex flex-col gap-2">
          {results.length > 0 ? (
            results.map((item) => (
              <ResultCard 
                key={`${item.country.name}-${item.currency.code}`}
                country={item.country}
                currency={item.currency}
                localAmount={item.localAmount}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl grayscale opacity-50">
                🌍
              </div>
              <p className="text-slate-500 font-medium">No millionaire status found yet.</p>
              <p className="text-slate-400 text-sm mt-1">Enter a higher amount to see where you rule.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;