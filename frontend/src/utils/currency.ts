
export const exchangeRates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.5,
    JPY: 151.2,
    AUD: 1.52,
    CAD: 1.36,
    CHF: 0.91,
    CNY: 7.23,
    NZD: 1.67,
    SEK: 10.85,
    KRW: 1350,
    SGD: 1.35,
    NOK: 10.95,
    MXN: 16.7,
    RUB: 92.5,
    ZAR: 18.8,
    TRY: 32.1,
    BRL: 5.1,
    AED: 3.67,
    HKD: 7.83
};

export const currencySymbols: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', JPY: '¥',
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', NZD: 'NZ$',
    SEK: 'kr', KRW: '₩', SGD: 'S$', NOK: 'kr', MXN: '$',
    RUB: '₽', ZAR: 'R', TRY: '₺', BRL: 'R$', AED: 'د.إ',
    HKD: 'HK$'
};

export const getCurrencySymbol = (code: string): string => {
    return currencySymbols[code] || '$';
};

export const convertPrice = (amountInUSD: number, targetCurrency: string): string => {
    const rate = exchangeRates[targetCurrency] || 1;
    const converted = amountInUSD * rate;

    // Format based on currency type (e.g., no decimals for JPY, KRW)
    if (['JPY', 'KRW'].includes(targetCurrency)) {
        return Math.round(converted).toLocaleString();
    }

    return converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
