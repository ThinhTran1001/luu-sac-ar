import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, method, url, statusCode, ...meta } = info;

    // Build request context string
    const reqContext =
      method && url ? ` [${method} ${url}${statusCode ? ` - ${statusCode}` : ''}]` : '';

    // Sensitive fields masking logic
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'resetPasswordToken'];
    const maskSensitive = (obj: unknown): unknown => {
      if (!obj || typeof obj !== 'object') return obj;
      const masked = (Array.isArray(obj) ? [...obj] : { ...obj }) as Record<string, unknown>;
      for (const key in masked) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
          masked[key] = '********';
        } else if (typeof masked[key] === 'object') {
          masked[key] = maskSensitive(masked[key]);
        }
      }
      return masked;
    };

    const cleanMeta = maskSensitive(meta) as Record<string, any>;
    const hasOtherMeta = Object.keys(cleanMeta).some((k) => k !== 'body');
    const hasBodyMeta =
      cleanMeta.body &&
      typeof cleanMeta.body === 'object' &&
      Object.keys(cleanMeta.body).length > 0;

    const metaStr =
      hasOtherMeta || hasBodyMeta
        ? `\n   Meta: ${JSON.stringify(cleanMeta, null, 2).replace(/\n/g, '\n   ')}`
        : '';

    return `${timestamp} ${level}:${reqContext} ${message}${metaStr}`;
  }),
);

const transports = [new winston.transports.Console()];

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
});
