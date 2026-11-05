import { ConsoleAppender, type Appender } from './appenders';
import type { LogHandler } from './handlers';
import type { LogEntry, LogLevel } from './log-entry';

export class Logger {
  constructor(
    private readonly appender: Appender = new ConsoleAppender(),
    private readonly handler?: LogHandler,
  ) {}

  debug(message: string, metadata?: LogEntry['metadata']): void {
    this.log('DEBUG', message, metadata);
  }

  info(message: string, metadata?: LogEntry['metadata']): void {
    this.log('INFO', message, metadata);
  }

  warn(message: string, metadata?: LogEntry['metadata']): void {
    this.log('WARN', message, metadata);
  }

  error(message: string, metadata?: LogEntry['metadata']): void {
    this.log('ERROR', message, metadata);
  }

  private log(level: LogLevel, message: string, metadata?: LogEntry['metadata']): void {
    const entry: LogEntry = { level, message, timestamp: new Date(), metadata };
    const append = () => this.appender.append(entry);

    if (this.handler) {
      this.handler.handle(entry, append);
    } else {
      append();
    }
  }
}
