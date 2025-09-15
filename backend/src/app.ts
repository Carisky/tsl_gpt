import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: false,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
