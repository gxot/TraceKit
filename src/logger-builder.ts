import { CompositeAppender, type Appender } from './appenders';
import type { LogHandler } from './handlers';
import { Logger } from './logger';

export class LoggerBuilder {
  private readonly appenders: Appender[] = [];
  private readonly handlers: LogHandler[] = [];

  addAppender(appender: Appender): this {
    this.appenders.push(appender);
    return this;
  }

  addHandler(handler: LogHandler): this {
    this.handlers.push(handler);
    return this;
  }

  build(): Logger {
    const appender = this.appenders.length > 1
      ? new CompositeAppender([...this.appenders])
      : this.appenders[0];

    const handler = this.handlers.reduceRight<LogHandler | undefined>(
      (next, current) => ({
        handle(entry, append) {
          current.handle(entry, () => {
            if (next) {
              next.handle(entry, append);
            } else {
              append();
            }
          });
        },
      }),
      undefined,
    );

    return new Logger(appender, handler);
  }
}
