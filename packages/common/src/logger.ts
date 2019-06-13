import { createLogger as cl, format, transports } from 'winston';
import { WinstonSentryTransport } from './WinstronSentryTransport';

export function createLogger(
  sentryDNS: string | null = null,
  tags: { source: string },
) {
  const consoleOptions = {
    format: format.json(),
    level: 'info',
  };

  const Logger = cl({
    format: format.json(),
    transports: [new transports.Console(consoleOptions)],
  });

  if (sentryDNS != null) {
    const sentryTransport = new WinstonSentryTransport({
      dsn: sentryDNS,
      level: 'warn',
      patchGlobal: true,
      tags,
    });

    Logger.add(sentryTransport);
  }

  return Logger;
}
