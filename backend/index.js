import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // untuk test
  next()
})
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});