import { createLogger } from '@baselayer/common';

export const Logger = createLogger(process.env.SENTRY_DSN, {
  source: 'server',
});
