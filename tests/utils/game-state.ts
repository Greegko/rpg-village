import { mergeDeepRight } from 'ramda';
import { GameState } from '../../src';

type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
}

export type TestGameState = PartialDeep<GameState>;
export const mergeGameState = (statesX: TestGameState, stateY: TestGameState) => mergeDeepRight(statesX, stateY);
