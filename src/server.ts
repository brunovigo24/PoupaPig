import dotenv from 'dotenv';
import { app } from './config/app';
import { logger } from './utils/logger';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const PORT = Number(process.env['PORT']) || 3000;
const HOST = process.env['HOST'] || '0.0.0.0';

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Iniciar servidor
const server = app.listen(PORT, HOST, () => {
  logger.info('🚀 Server started successfully', {
    port: PORT,
    host: HOST,
    environment: process.env['NODE_ENV'] || 'development',
    nodeVersion: process.version,
    platform: process.platform
  });
});

server.timeout = 30000; // 30 segundos de timeout

export { server };