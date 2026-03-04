import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import authRoutes from './routes/auth.routes';
import terraRoutes from './routes/terra.routes';
import fathomRoutes from './routes/fathom.routes';
import logisticsRoutes from './routes/logistics.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60
});

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:8080'];
app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({
      success: false,
      error: 'Too many requests'
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CropHub API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/terra', terraRoutes);
app.use('/api/fathom', fathomRoutes);
app.use('/api/logistics', logisticsRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`CropHub API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
