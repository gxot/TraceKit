import type { LogEntry } from './log-entry';

export interface LogFormatter {
  format(entry: LogEntry): string;
}

export class TextFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    const text = `[${entry.timestamp.toISOString()}] ${entry.level}: ${entry.message}`;

    return entry.metadata === undefined
      ? text
      : `${text} ${JSON.stringify(entry.metadata)}`;
  }
}

export class JsonFormatter implements LogFormatter {
  format(entry: LogEntry): string {
    return JSON.stringify(entry);
  }
}
