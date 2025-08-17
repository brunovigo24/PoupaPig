import { Request, Response } from 'express';

export class HealthController {
  
  public healthCheck = (_req: Request, res: Response): void => {
    const uptimeSeconds = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    let uptimeFormatted = '';
    if (hours > 0) uptimeFormatted += `${hours}h `;
    if (minutes > 0) uptimeFormatted += `${minutes}m `;
    uptimeFormatted += `${seconds}s`;

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: uptimeFormatted.trim()
    });
  };
}