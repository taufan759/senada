import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});