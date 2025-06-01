const API_URL = 'http://localhost:5000/api';

// Fungsi helper untuk melakukan fetch request
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Terjadi kesalahan pada server');
  }
  
  return response.json();
};

// Auth Services
export const authService = {
  login: (credentials) => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: (userData) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Transaction Services
export const transactionService = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`/transactions?${queryParams}`);
  },
  
  create: (transaction) => {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },
  
  update: (id, transaction) => {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  },
  
  delete: (id) => {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },
  
  getSummary: () => {
    return fetchWithAuth('/transactions/summary');
  },
};

// Financial Goals Services
export const goalService = {
  getAll: () => {
    return fetchWithAuth('/goals');
  },
  
  create: (goal) => {
    return fetchWithAuth('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
  },
  
  update: (id, goal) => {
    return fetchWithAuth(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    });
  },
  
  delete: (id) => {
    return fetchWithAuth(`/goals/${id}`, {
      method: 'DELETE',
    });
  },
};

// Investment Services
export const investmentService = {
  getPortfolio: () => {
    return fetchWithAuth('/investments/portfolio');
  },
  
  getRecommendations: (riskProfile) => {
    return fetchWithAuth(`/investments/recommendations?riskProfile=${riskProfile}`);
  },
  
  getRiskProfile: () => {
    return fetchWithAuth('/investments/risk-profile');
  },
  
  updateRiskProfile: (answers) => {
    return fetchWithAuth('/investments/risk-profile', {
      method: 'POST',
      body: JSON.stringify(answers),
    });
  },
};

// Article Services
export const articleService = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchWithAuth(`/articles?${queryParams}`);
  },
  
  getById: (id) => {
    return fetchWithAuth(`/articles/${id}`);
  },
};

export default {
  authService,
  transactionService,
  goalService,
  investmentService,
  articleService,
};