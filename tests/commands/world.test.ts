import { test, TestGameState, mergeGameState, withRandomID } from '../utils';
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

    test('should start Travel activity', {
      initState: mergeGameState(baseInitState, { world: { 'next-tile': { x: 0, y: 1 } } }),
      commands: [{ command: WorldCommand.Travel, args: { targetLocationId: 'next-tile', partyId: 'party-one' } }],
      expectedState: state => withRandomID(state.activities, { type: WorldActivity.Travel, state: { partyId: 'party-one' } }),
    });

    test('should not start Travel activity to same location', {
      initState: baseInitState,
      commands: [{ command: WorldCommand.Travel, args: { targetLocationId: 'village-tile', partyId: 'party-one' } }],
      expectedState: state => expect(state.activities).toEqual({}),
    });
  });

  describe('Explore', () => {
    const baseInitState: TestGameState = {
      units: {
        'test-unit': { id: 'test-unit' }
      },
      parties: { 'party-one': { unitIds: ['test-unit'], id: 'party-one' } },
    };

    test('should start Explore activity', {
      initState: mergeGameState(baseInitState, { world: { 'unexplored-tile': { explored: false } }, parties: { 'party-one': { locationId: 'unexplored-tile' } } }),
      commands: [{ command: WorldCommand.Explore, args: { partyId: 'party-one' } }],
      expectedState: state => withRandomID(state.activities, { type: WorldActivity.Explore, state: { partyId: 'party-one' } }),
    });

    test('should not start Explore activity on explored location', {
      initState: mergeGameState(baseInitState, { world: { 'explored-tile': { explored: true } }, parties: { 'party-one': { locationId: 'explored-tile' } } }),
      commands: [{ command: WorldCommand.Explore, args: { partyId: 'party-one' } }],
      expectedState: state => expect(state.activities).toEqual({}),
    });
  });
});
