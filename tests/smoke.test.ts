import { gameFactory } from './game-factory';
import * as expect from 'expect';

describe('Smoke test', () => {
  it('should pass the turn', () => {
    const game = gameFactory();
    const newState = game.gameTurn();

    expect(newState.general.turn).toBe(1);
  });
});
