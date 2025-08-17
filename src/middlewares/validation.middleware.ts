import { Request, Response, NextFunction } from 'express';

/**
 * Middleware básico de validação para webhooks
 */
export const validateWebhook = (req: Request, res: Response, next: NextFunction): void => {
  // Verificar se tem body
  if (!req.body) {
    res.status(400).json({
      error: 'Missing request body'
    });
    return;
  }

  // Verificar se tem evento
  if (!req.body.event) {
    res.status(400).json({
      error: 'Missing event field'
    });
    return;
  }

  next();
};