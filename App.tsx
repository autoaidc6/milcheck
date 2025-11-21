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
    // Note: rateToUSD in constants means 1 USD = X Currency.
    // So: Amount / Rate = USD Value
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
      
      {/* Sticky Header containing Inputs */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl">
              M
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-slate-900">
              Millionaire Status
            </h1>
          </div>

          {/* Input Group - Compact & Flex */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:max-w-xl">
            
            {/* Currency Select */}
            <div className="relative w-full sm:w-40 flex-shrink-0">
              <select
                id="currency"
                value={baseCurrencyCode}
                onChange={(e) => setBaseCurrencyCode(e.target.value)}
                className="w-full h-10 pl-3 pr-8 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all appearance-none cursor-pointer hover:bg-slate-100"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Amount Input */}
            <div className="relative w-full">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full h-10 pl-3 pr-12 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-medium text-slate-400 uppercase">
                Amount
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Flex below */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        
        {/* Status / Count */}
        <div className="mb-4 flex items-baseline justify-between">
           <p className="text-sm text-slate-500 font-medium">
             {results.length === 0 
               ? "Start typing to see results." 
               : `You are a millionaire in ${results.length} countr${results.length === 1 ? 'y' : 'ies'}.`}
           </p>
           {results.length > 0 && (
             <span className="text-xs text-gold-600 font-semibold bg-gold-50 px-2 py-1 rounded-full">
               Live Updates
             </span>
           )}
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((item) => (
              <ResultCard 
                key={`${item.country.name}-${item.currency.code}`}
                country={item.country}
                currency={item.currency}
                localAmount={item.localAmount}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-slate-900 font-serif font-semibold text-lg">Ready to explore?</h3>
            <p className="text-slate-500 text-sm max-w-xs mt-1">Enter your net worth above to instantly calculate your global millionaire status.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;