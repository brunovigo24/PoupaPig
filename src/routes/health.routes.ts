import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = new HealthController();

/**
 * @route GET /health
 * @desc Health check simples
 * @access Public
 */
router.get('/', healthController.healthCheck);

export { router as healthRoutes };