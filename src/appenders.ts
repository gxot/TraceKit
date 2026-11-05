import type { Writable } from 'node:stream';
import type { LogEntry } from './log-entry';
import { TextFormatter, type LogFormatter } from './formatters';

export interface Appender {
  append(entry: LogEntry): void;
}

export abstract class BaseAppender implements Appender {
  constructor(private readonly formatter: LogFormatter = new TextFormatter()) {}

  append(entry: LogEntry): void {
    this.write(this.formatter.format(entry));
  }

  protected abstract write(message: string): void;
}

export class ConsoleAppender extends BaseAppender {
  protected write(message: string): void {
    console.log(message);
  }
}

export class StreamAppender extends BaseAppender {
  constructor(private readonly stream: Writable, formatter?: LogFormatter) {
    super(formatter);
  }

  protected write(message: string): void {
    this.stream.write(`${message}\n`);
  }
}

export class MemoryAppender extends BaseAppender {
  private readonly messages: string[] = [];

  getMessages(): string[] {
    return [...this.messages];
  }

  protected write(message: string): void {
    this.messages.push(message);
  }
}

export class CompositeAppender implements Appender {
  constructor(private readonly appenders: readonly Appender[]) {}

  append(entry: LogEntry): void {
    for (const appender of this.appenders) {
      appender.append(entry);
    }
  }
}
