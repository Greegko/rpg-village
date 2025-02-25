import { Battlefield } from "../../battlefield";

export interface LoggerOptions {
  logTurnIterations?: number;
  logState?: {
    init?: boolean;
    turns?: number[];
    end?: boolean;
    testEnd?: boolean;
  };
}

export class TestLogger {
  constructor(
    private battlefield: Battlefield,
    private config: LoggerOptions,
    private loggerFn: (...args: any[]) => void,
  ) {
    if (config?.logState?.init) {
      this.loggerFn("Init");
      this.loggerFn(battlefield.getState());
    }
  }

  log(tick: number) {
    const state = this.battlefield.getState();

    if (this.config?.logTurnIterations && tick % this.config?.logTurnIterations === 0) {
      this.loggerFn("Turn", tick);
    }

    if (this.config?.logState?.turns?.includes(tick)) {
      this.loggerFn("Turn", tick);
      this.loggerFn(state);
    }

    if (this.battlefield.isFinished && this.config?.logState?.end) {
      this.loggerFn("End");
      this.loggerFn(state);
    }
  }

  testEnd(tick: number) {
    const state = this.battlefield.getState();
    if (this.config?.logState?.testEnd) {
      this.loggerFn("Test End - Turn", tick);
      this.loggerFn(state);
    }
  }
}

export const basicLoggerConfig = { logTurnIterations: 1, logState: { init: true, end: true } } as LoggerOptions;
