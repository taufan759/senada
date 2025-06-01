import express from 'express';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);

export default router;