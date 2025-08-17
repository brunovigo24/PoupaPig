import express from 'express';
import { webhookRoutes } from '../routes/webhook.routes';
import { healthRoutes } from '../routes/health.routes';
import { errorMiddleware } from '../middlewares/error.middleware';

const app = express();

app.use(express.json());

// Routes
app.use('/webhook', webhookRoutes);
app.use('/health', healthRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Error handling (must be last)
app.use(errorMiddleware);

export { app };