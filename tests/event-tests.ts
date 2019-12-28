import { gameFactory } from "./game-factory";
import { GameState } from '../src';
import { Event } from '../src/models';
import * as expect from 'expect';

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
}

type EventTest = { testName: string, initState: PartialDeep<GameState>, events: (Event | string)[], expectedState: PartialDeep<GameState> };

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

    expect(game.getState()).toMatchObject(expectedState);
  });
}
