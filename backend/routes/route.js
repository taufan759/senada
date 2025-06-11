import express from 'express';
import { authenticate, getUsers, register } from '../controllers/UserController.js';
import { addTransaction, deleteTransaction, getTransaction, updateTransaction } from '../controllers/TransactionController.js';
import { predictCashflow, checkMLServiceHealth } from '../controllers/MLController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);

// Group routes yang memerlukan otentikasi
router.use('/transactions', verifyToken, authorize('user', 'admin'));

router.get('/transactions', getTransaction);
router.post('/transactions/add', addTransaction);
router.put('/transactions/update/:transactionId', updateTransaction);
router.delete('/transactions/delete/:transactionId', deleteTransaction);

router.post('/authenticate', authenticate);
router.post('/register', register);

// ML routes (protected)
router.get('/ml/health', checkMLServiceHealth);
router.post('/ml/predict', verifyToken, authorize('user', 'admin'), predictCashflow);
router.post('/ml/tips', verifyToken, authorize('user', 'admin'), getFinancialTips);


export default router;