import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateWebhook } from '../middlewares/validation.middleware';

const router = Router();
const webhookController = new WebhookController();

/**
 * @route POST /webhook/message
 * @desc Recebe mensagens da Evolution API
 */
router.post('/message', authMiddleware, validateWebhook, webhookController.handleWebhook);

export { router as webhookRoutes };