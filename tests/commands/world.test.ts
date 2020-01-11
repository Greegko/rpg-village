import { commandTest, TestGameState, mergeGameState } from '../utils/command-tests';
import { WorldCommand, WorldActivity } from '../../src/modules/world/interfaces';
import * as expect from 'expect';

describe('WorldCommand', () => {
  describe('Travel', () => {
    const baseInitState: TestGameState = {
      units: {
        'test-unit': { id: 'test-unit' }
      },
      parties: { 'party-one': { locationId: 'village-tile', unitIds: ['test-unit'], id: 'party-one' } },
      world: { 'village-tile': { x: 0, y: 0, explored: true } }
    };

    commandTest({
      testName: 'should start Travel activity',
      initState: mergeGameState(baseInitState, { world: { 'next-tile': { x: 0, y: 1 } } }),
      commands: [{ command: WorldCommand.Travel, args: { targetLocationId: 'next-tile', partyId: 'party-one' } }],
      expectedState: state => withRandomID(state.activities, { type: WorldActivity.Travel, state: { partyId: 'party-one' } }),
    });
  });
});

function withRandomID<T extends object, P extends keyof T>(state: T, subState: Partial<T[P]>): any {
  const keys = Object.keys(state);

  expect(keys.length).toBe(1);

  const randomID = keys[0] as P;
  expect(state[randomID]).toMatchObject(subState);
}
