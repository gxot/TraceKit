import type { LogEntry, LogLevel } from './log-entry';

export interface LogHandler {
  handle(entry: LogEntry, next: () => void): void;
}

const levelPriority: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

export class LevelFilterHandler implements LogHandler {
  constructor(private readonly minimumLevel: LogLevel) {}

  handle(entry: LogEntry, next: () => void): void {
    if (levelPriority[entry.level] >= levelPriority[this.minimumLevel]) {
      next();
    }
  }
}

export class PredicateFilterHandler implements LogHandler {
  constructor(private readonly predicate: (entry: LogEntry) => boolean) {}

  handle(entry: LogEntry, next: () => void): void {
    if (this.predicate(entry)) {
      next();
    }
  }
}
