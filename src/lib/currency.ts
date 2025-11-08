// Utility to convert USD to INR
const USD_TO_INR_RATE = 83.50; // Approximate conversion rate

export function convertToINR(usdAmount: number): number {
  return usdAmount * USD_TO_INR_RATE;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;
}

export function formatPriceFromUSD(usdAmount: string | number): string {
  const amount = typeof usdAmount === 'string' ? parseFloat(usdAmount) : usdAmount;
  return formatINR(convertToINR(amount));
}
