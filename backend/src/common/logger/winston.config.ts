import { format, transports } from 'winston';

export const winstonConfig = {
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    format.errors({ stack: true }), 
    format.splat(),
    format.json() 
  ),

  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), 
        format.printf(({ level, message, timestamp, context, stack }) => {
          return `${timestamp} [${context || 'Dogchat-Core'}] ${level}: ${message} ${stack ? '\n' + stack : ''}`;
        })
      ),
    }),

    new transports.File({
      filename: 'logs/security-error.log',
      level: 'error', 
    }),
    new transports.File({
      filename: 'logs/dogchat-audit.log', 
    }),
  ],
};
