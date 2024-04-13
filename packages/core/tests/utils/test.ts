import * as ava from "ava";
import * as util from "node:util";
import { argv } from "process";

import { Command, Event, GameConfig, GameState } from "@rpg-village/core";

import {
  ExecutionTestContext,
  lengthAssertionFactory,
  undefinedAssertionFactory,
  withRandomIDAssertionFactory,
} from "./custom-assertions";
import { GameModules, gameFactory } from "./game-factory";
import { PartialDeep } from "./partial-deep";

util.inspect.defaultOptions.depth = 5;

export type TestGameState = PartialDeep<GameState>;
type ExpectedStateMatcher = (state: GameState, t: ExecutionTestContext<unknown>) => void;
type ExpectedState = TestGameState | ExpectedStateMatcher;

type Test = {
  initState: TestGameState;
  gameConfig?: GameConfig;
  commands?: Command | Command[];
  event?: Event;
  turn?: boolean | number;
  expectedState: ExpectedState | ExpectedState[];
};

const project_dir = argv[1].replace(/node_modules.*/, "");

export function test(
  testName: string,
  { gameConfig = { modules: GameModules }, initState, commands, event, expectedState, turn = 0 }: Test,
) {
  const testFilePath = new Error()
    .stack!.split("\n")[2]
    .replace("at <anonymous> (", "")
    .slice(0, -1)
    .replace(project_dir, "");

  ava.default(testName + " - " + testFilePath, t => {
    const game = gameFactory({ state: initState as GameState, config: gameConfig });

    if (commands) {
      if (Array.isArray(commands)) {
        commands.forEach(command => {
          game.executeCommand(command);
        });
      } else {
        game.executeCommand(commands);
      }
    }

    if (event) {
      game.emitEvent(event);
    }

    for (let i = 0; i < +turn; i++) {
      game.gameTurn();
    }

    const gameState = game.getState();

    const testExpectedState = (expectedState: ExpectedState) => {
      if (typeof expectedState === "object") {
        t.like(gameState, expectedState);
      } else {
        expectedState(gameState, {
          ...t,
          withRandomId: withRandomIDAssertionFactory(t),
          length: lengthAssertionFactory(t),
          undefined: undefinedAssertionFactory(t),
        });
      }
    };

    if (Array.isArray(expectedState)) {
      expectedState.forEach(testExpectedState);
    } else {
      testExpectedState(expectedState);
    }
  });
}
