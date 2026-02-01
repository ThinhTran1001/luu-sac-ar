import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import httpLogger from './middlewares/logger.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(httpLogger);

app.get('/', (req, res) => {
  res.send('Luu Sac API is running');
});

app.use('/api', routes);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
