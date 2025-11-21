export interface Currency {
  code: string;
  name: string;
  rateToUSD: number; // How many units of this currency = 1 USD
  symbol: string;
}

export interface Country {
  name: string;
  currencyCode: string;
  flagEmoji: string;
  flagUrl?: string; // Optional detailed flag
}

export interface MillionaireResult {
  country: Country;
  currency: Currency;
  localAmount: number;
}
