// Formatting and helper utilities for Safe Meds prototype

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr;
};

export const generateDemoId = (prefix = 'SM') => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};
