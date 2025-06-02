import express from 'express';
import { authenticate, getUsers, register } from '../controllers/UserController.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);
router.post('/authenticate', authenticate);
router.post('/register', register);

export default router;