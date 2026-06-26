// boutique-frontend/lib/currency.js

/**
 * Format a number as Nigerian Naira (₦)
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, decimals = 0) => {
  if (amount === null || amount === undefined) return '₦0';
  const num = Number(amount);
  if (isNaN(num)) return '₦0';
  return `₦${num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
};

/**
 * Format price for display (no decimals, with commas)
 */
export const formatPrice = (amount) => {
  return formatCurrency(amount, 0);
};

/**
 * Format price with 2 decimal places (for cents, if needed)
 */
export const formatPriceWithCents = (amount) => {
  return formatCurrency(amount, 2);
};