// Format currency to IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString, format = 'long') => {
  const date = new Date(dateString);
  
  // If date is invalid, return the original string
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  if (format === 'short') {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
  
  if (format === 'medium') {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

// Shorten large numbers
export const shortenNumber = (num) => {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}Jt`;
  }
  
  return `${(num / 1000000000).toFixed(1)}M`;
};

// Calculate goal progress percentage
export const calculateProgress = (current, target) => {
  if (!current || !target || target === 0) {
    return 0;
  }
  
  const progress = (current / target) * 100;
  return Math.min(progress, 100); // Cap at 100%
};

// Format transaction description
export const formatTransactionDesc = (description, maxLength = 30) => {
  if (!description) {
    return '';
  }
  
  if (description.length <= maxLength) {
    return description;
  }
  
  return `${description.substring(0, maxLength)}...`;
};

// Format date range for reports
export const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate, 'medium');
  const end = formatDate(endDate, 'medium');
  
  return `${start} - ${end}`;
};

// Get category color
export const getCategoryColor = (category) => {
  const categoryColors = {
    food: '#FF6384',        // Merah muda
    transportation: '#36A2EB', // Biru
    entertainment: '#FFCE56',  // Kuning
    shopping: '#4BC0C0',     // Cyan
    bills: '#9966FF',     // Ungu
    health: '#FF9F40',     // Oranye
    education: '#8AC44B',    // Hijau
    salary: '#63FF84',     // Hijau muda
    bonus: '#84FF63',     // Lime
    investment: '#638AFF',    // Biru muda
    others: '#C9C9C9',     // Abu-abu
  };
  
  return categoryColors[category] || '#C9C9C9';
};

export default {
  formatCurrency,
  formatDate,
  formatPercentage,
  shortenNumber,
  calculateProgress,
  formatTransactionDesc,
  formatDateRange,
  getCategoryColor,
};