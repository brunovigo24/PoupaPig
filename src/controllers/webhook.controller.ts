import { Request, Response } from 'express';
import { MessageService, WebhookDados } from '../services/message.service';
import { logger } from '../utils/logger';

export class WebhookController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  public handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const dados: WebhookDados = req.body;
      logger.info('[Webhook] Dados recebidos');

      if (!dados?.data?.key) {
        res.status(400).json({ error: 'Dados inválidos' });
        return;
      }

      await this.messageService.processMessage(dados);

      res.json({ status: 'ok' });

    } catch (error) {
      logger.error('[Webhook] Erro:', error);
      res.status(500).json({ error: 'Erro ao processar mensagem' });
    }
  };
}