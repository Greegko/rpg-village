import { Battlefield } from "../../src";

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

  log() {
    const state = this.battlefield.getState();

    if (this.config?.logTurnIterations && state.tick % this.config?.logTurnIterations === 0) {
      this.loggerFn("Turn", state.tick);
    }

    if (this.config?.logState?.turns?.includes(state.tick)) {
      this.loggerFn("Turn", state.tick);
      this.loggerFn(state);
    }

    if (this.battlefield.isFinished && this.config?.logState?.end) {
      this.loggerFn("End");
      this.loggerFn(state);
    }
  }

  testEnd() {
    const state = this.battlefield.getState();
    if (this.config?.logState?.testEnd) {
      this.loggerFn("Test End - Turn", state.tick);
      this.loggerFn(state);
    }
  }
}

export const basicLoggerConfig = { logTurnIterations: 1, logState: { init: true, end: true } } as LoggerOptions;
