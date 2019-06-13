import * as Sentry from '@sentry/node';
import Transport = require('winston-transport');

export class WinstonSentryTransport extends Transport {
  constructor(opts: any) {
    super(opts);
    Sentry.init(opts);
  }

  log(chunk: any, cb: any) {
    if (chunk.level === 'warn') {
      Sentry.captureMessage(chunk.message, Sentry.Severity.Warning);
      return cb();
    }

    if (chunk.level === 'error') {
      const error = new Error(chunk.message);
      error.name = chunk.path;

      // Get stracktrace from original error
      const trace = Object.getOwnPropertySymbols(chunk).find(s => {
        return String(s) === 'Symbol(splat)';
      });

      Sentry.withScope(scope => {
        scope.setExtra('stacktrace', trace ? chunk[trace] : 'none');
        Sentry.captureException(error);
        return cb();
      });
    }
  }
}
