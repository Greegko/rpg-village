import * as ava from "ava";
import * as util from "util";
import { gameFactory } from "./game-factory";
import { GameState, Command } from "../../public-api";
import { PartialDeep } from "./deep-partial";
import { ExecutionTestContext, withRandomIDAssertionFactory } from "./custom-assertions";

util.inspect.defaultOptions.depth = 5;

export type TestGameState = PartialDeep<GameState>;
type ExpectedStateMatcher = (state: GameState, t: ExecutionTestContext<unknown>) => void;
type ExpectedState = TestGameState | ExpectedStateMatcher;

type Test = {
  initState: TestGameState;
  commands?: (Command | string)[];
  turn?: boolean | number;
  expectedState: ExpectedState;
};

export function test(testName: string, { initState, commands, expectedState, turn = 0 }: Test) {
  ava.default(testName, t => {
    const game = gameFactory({ state: initState } as any);

    if (commands) {
      commands.forEach(command => {
        if (typeof command === "string") {
          game.executeCommand({ command });
        } else {
          game.executeCommand(command);
        }
      });
    }

    for (let i = 0; i < turn; i++) {
      game.gameTurn();
    }

    const gameState = game.getState();

    if (typeof expectedState === "object") {
      t.like(gameState, expectedState);
    } else {
      expectedState(gameState, { ...t, withRandomId: withRandomIDAssertionFactory(t) });
    }
  });
}
