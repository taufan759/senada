import express from 'express';
import { authenticate, getUsers, register } from '../controllers/UserController.js';
import { addTransaction, deleteTransaction, getTransaction, updateTransaction } from '../controllers/TransactionController.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);
router.get('/transactions', getTransaction);

router.post('/transactions/add', addTransaction);
router.put('/transactions/update/:transactionId', updateTransaction);
router.delete('/transactions/delete/:transactionId', deleteTransaction);

router.post('/authenticate', authenticate);
router.post('/register', register);

export default router;