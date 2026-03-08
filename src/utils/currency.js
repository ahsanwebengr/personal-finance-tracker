const CURRENCY_MAP = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro', locale: 'de-DE' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound', locale: 'en-GB' },
  INR: { symbol: '₹', code: 'INR', name: 'Indian Rupee', locale: 'en-IN' },
  JPY: { symbol: '¥', code: 'JPY', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { symbol: 'A$', code: 'AUD', name: 'Australian Dollar', locale: 'en-AU' },
  PKR: { symbol: '₨', code: 'PKR', name: 'Pakistani Rupee', locale: 'ur-PK' },
};

export function formatCurrency(amount, currencyCode = 'USD') {
  const currency = CURRENCY_MAP[currencyCode] || CURRENCY_MAP.USD;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.symbol}${Number(amount).toFixed(2)}`;
  }
}

export function getCurrencies() {
  return Object.values(CURRENCY_MAP);
}

export { CURRENCY_MAP };
