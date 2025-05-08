const storageService = {
  // Set data
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  },
  
  // Get data
  getItem: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  },
  
  // Remove data
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  },
  
  // Clear all data
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
  
  // Methods for specific data types
  
  // Auth data
  setAuthData: (token, user) => {
    storageService.setItem('token', token);
    storageService.setItem('user', user);
  },
  
  getAuthData: () => {
    return {
      token: storageService.getItem('token'),
      user: storageService.getItem('user'),
    };
  },
  
  clearAuthData: () => {
    storageService.removeItem('token');
    storageService.removeItem('user');
  },
  
  // Transactions
  setTransactions: (transactions) => {
    return storageService.setItem('transactions', transactions);
  },
  
  getTransactions: () => {
    return storageService.getItem('transactions') || [];
  },
  
  addTransaction: (transaction) => {
    const transactions = storageService.getTransactions();
    const newTransaction = {
      ...transaction,
      id: Date.now(), // Simple unique ID
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    transactions.push(newTransaction);
    storageService.setTransactions(transactions);
    return newTransaction;
  },
  
  // Financial Goals
  setGoals: (goals) => {
    return storageService.setItem('goals', goals);
  },
  
  getGoals: () => {
    return storageService.getItem('goals') || [];
  },
  
  // User Settings
  setSettings: (settings) => {
    return storageService.setItem('settings', settings);
  },
  
  getSettings: () => {
    return storageService.getItem('settings') || {
      theme: 'light',
      notifications: true,
      currency: 'IDR',
    };
  },
};

export default storageService;