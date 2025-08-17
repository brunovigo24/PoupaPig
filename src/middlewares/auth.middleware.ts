import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autenticação simples para webhooks
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Verificar Bearer token
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Missing Bearer token'
    });
    return;
  }

  const token = authHeader.substring(7);
  
  if (token !== process.env['WEBHOOK_TOKEN']) {
    res.status(401).json({
      error: 'Invalid token'
    });
    return;
  }

  next();
};