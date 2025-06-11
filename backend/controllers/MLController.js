import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

export const predictCashflow = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Call ML Service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      userId: userId
    });

    if (mlResponse.data.status === 'success') {
      return res.status(200).json({
        success: true,
        message: 'Cashflow prediction retrieved successfully',
        data: mlResponse.data.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to get prediction from ML service',
        error: mlResponse.data.error
      });
    }

  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML Service is not available. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while predicting cashflow',
      error: error.message
    });
  }
};

export const getFinancialTips = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Call ML Service for recommendations
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/recommend-tips`, {
      userId: userId
    });

    if (mlResponse.data.status === 'success') {
      return res.status(200).json({
        success: true,
        message: 'Financial tips retrieved successfully',
        data: mlResponse.data.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to get recommendations from ML service',
        error: mlResponse.data.error
      });
    }

  } catch (error) {
    console.error('ML Recommendation Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'ML Service is not available. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while getting recommendations',
      error: error.message
    });
  }
};

export const checkMLServiceHealth = async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`);

    return res.status(200).json({
      success: true,
      message: 'ML Service is healthy',
      data: response.data
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'ML Service is not healthy',
      error: error.message
    });
  }
};