import * as expect from "expect";
import { gameFactory } from "../game-factory";
import { GameState, Command } from "../../public-api";
import { PartialDeep } from "./deep-partial";

export type TestGameState = PartialDeep<GameState>;
type ExpectedStateMatcher = (state: GameState) => any;
type ExpectedState = TestGameState | ExpectedStateMatcher;

type Test = {
  initState: TestGameState;
  commands?: (Command | string)[];
  turn?: boolean | number;
  expectedState: ExpectedState;
};

export function test(testName: string, { initState, commands, expectedState, turn = 0 }: Test) {
  it(testName, () => {
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
      expect(gameState).toMatchObject(expectedState as any);
    } else {
      expectedState(gameState);
    }
  });
}
