import { gameFactory } from './game-factory';
import * as expect from 'expect';
import { VillageEvents } from '../src';

describe('Village', () => {
  describe('VillageEvents', () => {
    describe('GenerateGold', () => {
      it('should generate 5 gold', () => {
        const game = gameFactory();

        game.fireEvent({ event: VillageEvents.GenerateGold });

        const state = game.getState();

        expect(state.village.stash.resource.gold).toBe(5);
      });
    });
  });
});
