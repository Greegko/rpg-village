import { merge } from "rambda";
import { expect, it } from "vitest";

import { Map } from "@/features/map";

import { BattlefieldState } from "../../context/battlefield";
import { createBattlefieldInstance } from "../../create-battlefield-instance";
import { clearInstances as clearBattlefieldInstances } from "../../injection-container";
import { BattlefieldConfig } from "../../interface";
import { PartialDeep } from "../interfaces/partial-deep";
import { createPlayableUrl } from "./create-playable-url";
import { getMapSize } from "./get-map-size";
import { LoggerOptions, TestLogger } from "./test-logger";

type TestState = BattlefieldState;
type ExpectedState = PartialDeep<TestState> | ((state: TestState) => void);

interface TestConfig {
  only?: boolean;
  seed?: string;
  map: Partial<Map>;
  turn?: number | boolean;
  runUntilFinish?: boolean;
  expectedState?: ExpectedState | ExpectedState[];
  expectedTurn?: number;
  loggerConfig?: LoggerOptions;
  createPlayableLink?: boolean;
}

export function test(
  testName: string,
  { map, turn, runUntilFinish, expectedState, expectedTurn, loggerConfig, createPlayableLink, seed, only }: TestConfig,
) {
  (only ? it.only : it)(testName, () => {
    const mapWithDefault = merge({ tiles: [], tileSize: 0, size: getMapSize(map?.units || []), units: [], mapObjects: [] }, map);

    const config = {
      map: mapWithDefault,
      seed: seed || Math.random().toString(),
    } as BattlefieldConfig;

    clearBattlefieldInstances();

    const battlefield = createBattlefieldInstance(config, null!);

    if (createPlayableLink) {
      console.log("Playable url");
      console.log(createPlayableUrl(mapWithDefault, config.seed));
    }

    const logger = new TestLogger(battlefield, loggerConfig || {}, console.log);

    let finalTurn = 0;
    for (let i = 0; i < new Number(turn).valueOf(); i++) {
      battlefield.tick();
      logger.log(i);

      finalTurn = i;

      if (battlefield.isFinished) break;
    }

    if (runUntilFinish) {
      finalTurn = 0;
      while (!battlefield.isFinished) {
        finalTurn++;
        battlefield.tick();
        logger.log(finalTurn);
      }
    }

    logger.testEnd(finalTurn);

    const gameState = battlefield.getState();
    const testExpectedState = (expectedState: ExpectedState) => {
      if (typeof expectedState === "object") {
        expect(gameState).toMatchObject(expectedState);
      } else {
        expectedState(gameState);
      }
    };

    if (expectedState) {
      if (Array.isArray(expectedState)) {
        expectedState.forEach(testExpectedState);
      } else {
        testExpectedState(expectedState);
      }
    }

    if (expectedTurn) {
      expect(expectedTurn).toBe(finalTurn);
    }
  });
}
