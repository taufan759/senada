import express from 'express';
import { authenticate, getUsers, register } from '../controllers/UserController.js';
import { addTransaction, budgetTransactions, deleteTransaction, getTransaction, updateTransaction } from '../controllers/TransactionController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import authorize from '../middleware/authorize.js';
import { addBudget, getBudget } from '../controllers/BudgetController.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);

// Group routes yang memerlukan otentikasi
router.use('/transactions', verifyToken, authorize('user', 'admin'));

router.get('/transactions', getTransaction);
router.post('/transactions/add', addTransaction);
router.put('/transactions/update/:transactionId', updateTransaction);
router.delete('/transactions/delete/:transactionId', deleteTransaction);

router.get('/budget', getBudget);
router.post('/budget/add', addBudget);
router.get('/budget/transactions', budgetTransactions);

router.post('/authenticate', authenticate);
router.post('/register', register);

export default router;