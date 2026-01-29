import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import { API_ROUTES } from '@luu-sac/shared';
import { globalErrorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Luu Sac API is running');
});

app.use(API_ROUTES.AUTH.BASE, authRoutes);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
