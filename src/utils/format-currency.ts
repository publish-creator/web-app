export const formatCurrency = (amount: number, currency: string = 'USD') => {
  const value = amount / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};
