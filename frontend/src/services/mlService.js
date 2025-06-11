import AppSettings from '../AppSettings';
import api from './api';

const mlService = {
  // Get cashflow prediction
  getCashflowPrediction: async () => {
    try {
      const response = await api.post('/ml/predict');
      return response.data;
    } catch (error) {
      console.error('Error getting cashflow prediction:', error);
      throw error;
    }
  },

  // Get financial tips recommendations
  getFinancialTips: async () => {
    try {
      const response = await api.post('/ml/tips');
      return response.data;
    } catch (error) {
      console.error('Error getting financial tips:', error);
      throw error;
    }
  },

  // Check ML service health
  checkMLHealth: async () => {
    try {
      const response = await api.get('/ml/health');
      return response.data;
    } catch (error) {
      console.error('ML Service health check failed:', error);
      return { success: false, message: 'ML Service unavailable' };
    }
  }
};

export default mlService;