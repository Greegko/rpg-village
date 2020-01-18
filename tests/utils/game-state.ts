import { mergeDeepRight } from 'ramda';
import { GameState } from '../../src';
import { PartialDeep } from './deep-partial';

export type TestGameState = PartialDeep<GameState>;
export const mergeGameState = (statesX: TestGameState, stateY: TestGameState) => mergeDeepRight(statesX, stateY);
