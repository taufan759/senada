import express from 'express';
import { authenticate, getUsers, register } from '../controllers/UserController.js';
import { addTransaction, budgetTransactions, deleteTransaction, getTransaction, updateTransaction } from '../controllers/TransactionController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import authorize from '../middleware/authorize.js';
import { addBudget, deleteBudget, getBudget, updateBudget } from '../controllers/BudgetController.js';
import { addRecommend, getRecommend } from '../controllers/RecommendController.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);

// Group routes yang memerlukan otentikasi
router.use('/transactions', verifyToken, authorize('user', 'admin'));

router.get('/transactions', getTransaction);
router.post('/transactions/add', addTransaction);
router.put('/transactions/update/:transactionId', updateTransaction);
router.delete('/transactions/delete/:transactionId', deleteTransaction);

router.use('/budget', verifyToken, authorize('user', 'admin'));

router.get('/budget', getBudget);
router.post('/budget/add', addBudget);
router.delete('/budget/delete/:budgetId', deleteBudget);
router.put('/budget/update/:budgetId', updateBudget);
router.get('/budget/transactions', budgetTransactions);

router.get('/recommend', getRecommend);
router.post('/recommend', async (req, res) => {
  try {
    const response = await fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
    return data;
  } catch (error) {
    res.status(500).json({ error: 'ML Service Error' });
  }
});
router.post('/recommend/add', addRecommend)

router.post('/authenticate', authenticate);
router.post('/register', register);

export default router;