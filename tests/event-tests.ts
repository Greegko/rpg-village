import { gameFactory } from "./game-factory";
import { GameState } from '../src';
import { Event } from '../src/models';
import * as expect from 'expect';
import { Matchers } from 'expect';

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
}

type ExpectedStateMatcher = (state: GameState) => Matchers<GameState>;
type ExpectedState = object | ExpectedStateMatcher;

type EventTest = {
  testName: string;
  initState: PartialDeep<GameState>;
  events: (Event | string)[];
  expectedState: ExpectedState;
};

export function eventTest({ testName, initState, events, expectedState }: EventTest) {
  it(testName, () => {
    const game = gameFactory({ state: initState } as any);

    events.forEach(event => {
      if (typeof event === 'string') {
        game.fireEvent({ event });
      } else {
        game.fireEvent(event);
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
