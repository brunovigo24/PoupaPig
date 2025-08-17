import { logger } from '../utils/logger';

export interface WebhookDados {
  data?: {
    key?: {
      fromMe?: boolean;
      remoteJid?: string;
      id?: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      listResponseMessage?: {
        singleSelectReply?: {
          selectedRowId?: string;
        };
      };
      // Suporte para arquivos/imagens
      imageMessage?: {
        url?: string;
        mimetype?: string;
        caption?: string;
        fileLength?: string;
        height?: number;
        width?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        jpegThumbnail?: string;
        contextInfo?: any;
      };
      documentMessage?: {
        url?: string;
        mimetype?: string;
        fileName?: string;
        fileLength?: string;
        pageCount?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        contextInfo?: any;
      };
      videoMessage?: {
        url?: string;
        mimetype?: string;
        caption?: string;
        fileLength?: string;
        height?: number;
        width?: number;
        seconds?: number;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        jpegThumbnail?: string;
        contextInfo?: any;
      };
      audioMessage?: {
        url?: string;
        mimetype?: string;
        seconds?: number;
        ptt?: boolean;
        mediaKey?: string;
        directPath?: string;
        mediaKeyTimestamp?: string;
        contextInfo?: any;
      };
    };
  };
  instance?: string;
}

export class MessageService {
  
  /**
   * Processa mensagem recebida via webhook
   */
  public async processMessage(dados: WebhookDados): Promise<void> {
    try {
      if (dados?.data?.key?.fromMe) {
        logger.info('[MessageService] Mensagem ignorada - fromMe = true');
        return;
      }

      const remoteJid = dados?.data?.key?.remoteJid;
      const telefone = remoteJid ? this.extractPhoneNumber(remoteJid) : undefined;
      const instancia = dados?.instance;
      const nomePessoa = dados?.data?.pushName || 'Desconhecido';
      const idMensagem = dados?.data?.key?.id;
      
      const mensagem =
        dados?.data?.message?.conversation ||
        dados?.data?.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        '';

      if (!remoteJid || !telefone) {
        logger.warn('[MessageService] Telefone não informado');
        return;
      }

      if (!mensagem) {
        logger.info('[MessageService] Mensagem ignorada - sem texto');
        return;
      }

      logger.info('[MessageService] Processing message:', {
        telefone,           // Só números: "5511999999999"
        remoteJid,         // Completo: "5511999999999@s.whatsapp.net"
        mensagem,
        nomePessoa,
        instancia,
        idMensagem
      });

      // TODO: Implementar lógica de processamento
      // 1. Salvar usuário/mensagem no banco
      // 2. Verificar se precisa de IA
      // 3. Gerar resposta
      // 4. Enviar resposta via Evolution API

      logger.debug('[MessageService] Message details:', {
        messageLength: mensagem.length,
        hasImage: !!dados?.data?.message?.imageMessage,
        hasDocument: !!dados?.data?.message?.documentMessage,
        hasVideo: !!dados?.data?.message?.videoMessage,
        hasAudio: !!dados?.data?.message?.audioMessage
      });

    } catch (error) {
      logger.error('[MessageService] Error processing message:', error);
      throw error;
    }
  }

  private extractPhoneNumber(remoteJid: string): string {
    return remoteJid.split('@')[0];
  }

  /**
   * Verifica se a mensagem precisa de processamento de IA
   */
  private needsAIProcessing(text: string): boolean {
    // Triggers para IA, vou pensar nessa lógica de ativação de IA mais tarde
    const aiTriggers = [
      'ajuda',
      'help',
      '?',
      'como',
      'quanto',
      'gastos',
      'receitas',
      'balanço',
      'relatório'
    ];

    const textLower = text.toLowerCase();
    return aiTriggers.some(trigger => textLower.includes(trigger));
  }
}