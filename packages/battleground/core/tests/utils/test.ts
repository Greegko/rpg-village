import { expect, test as vitestTest } from "vitest";

import { Battlefield, BattlefieldConfig, BattlefieldInit, BattlefieldState } from "../../src";
import { createPlayableUrl } from "./create-playable-url";
import { getMapSize } from "./get-map-size";
import { PartialDeep } from "./partial-deep";
import { LoggerOptions, TestLogger } from "./test-logger";

type TestState = PartialDeep<BattlefieldState & { turn: number }>;
type ExpectedState = TestState | ((state: TestState) => void);

interface TestConfig {
  seed?: string;
  initialState: BattlefieldInit;
  turn?: number | boolean;
  runUntilFinish?: boolean;
  expectedState: ExpectedState | ExpectedState[];
  loggerConfig?: LoggerOptions;
  createPlayableLink?: boolean;
}

export function test(
  testName: string,
  { initialState, turn, runUntilFinish, expectedState, loggerConfig, createPlayableLink, seed }: TestConfig,
) {
  vitestTest(testName, t => {
    const config = {
      mapSize: getMapSize(initialState),
      speed: 1,
      seed: seed || Math.random().toString(),
    } as BattlefieldConfig;
    const battlefield = new Battlefield(config, null);
    battlefield.init(initialState);

    if (createPlayableLink) {
      console.log("Playable url");
      console.log(createPlayableUrl(initialState, seed));
    }

    const logger = new TestLogger(battlefield, loggerConfig, console.log);

    for (let i = 0; i < +turn; i++) {
      battlefield.tick();
      logger.log();

      if (battlefield.isFinished) break;
    }

    if (runUntilFinish) {
      while (!battlefield.isFinished) {
        battlefield.tick();
        logger.log();
      }
    }

    logger.testEnd();

    const gameState = battlefield.getState();
    const testExpectedState = (expectedState: ExpectedState) => {
      if (typeof expectedState === "object") {
        expect(gameState).toMatchObject(expectedState);
      } else {
        expectedState(gameState);
      }
    };

    if (Array.isArray(expectedState)) {
      expectedState.forEach(testExpectedState);
    } else {
      testExpectedState(expectedState);
    }
  });
}
