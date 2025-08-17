import { Request, Response, NextFunction } from 'express';

/**
 * Middleware simples de tratamento de erros
 */
export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env['NODE_ENV'] === 'development' ? error.message : 'Something went wrong'
  });
};