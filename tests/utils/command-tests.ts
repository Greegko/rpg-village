import { gameFactory } from "../game-factory";
import { GameState } from '../../src';
import { Command } from '../../src/models';
import * as expect from 'expect';
import { Matchers } from 'expect';

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
}

type ExpectedStateMatcher = (state: GameState) => Matchers<GameState>;
type ExpectedState = object | ExpectedStateMatcher;

type CommandTest = {
  testName: string;
  initState: PartialDeep<GameState>;
  commands: (Command | string)[];
  expectedState: ExpectedState;
};

export function commandTest({ testName, initState, commands, expectedState }: CommandTest) {
  it(testName, () => {
    const game = gameFactory({ state: initState } as any);

    commands.forEach(command => {
      if (typeof command === 'string') {
        game.executeCommand({ command });
      } else {
        game.executeCommand(command);
      }
    });

    const gameState = game.getState();

    if (typeof expectedState === 'object') {
      expect(gameState).toMatchObject(expectedState as any);
    } else {
      expectedState(gameState);
    }
  });
}
