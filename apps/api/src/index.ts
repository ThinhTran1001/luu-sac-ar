import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import httpLogger from './middlewares/logger.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

const corsOriginList = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'https://localhost:3000'];

const isDev = process.env.NODE_ENV !== 'production';

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (corsOriginList.includes(origin)) return cb(null, true);
      if (isDev) return cb(null, origin);
      cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
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
