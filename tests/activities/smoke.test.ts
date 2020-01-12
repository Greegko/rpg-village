import { test } from '../utils';
import { WorldActivity } from '../../src';
import * as expect from 'expect';

describe('Activities', () => {
  describe('Smoke Test', () => {
    test({
      testName: 'should resolve activty result',
      initState: { activities: { 'test-activity-id': { type: WorldActivity.Travel, state: { partyId: 'test-party', progress: 1, targetLocationId: 'location-2' } as any, } }, parties: { 'test-party': { locationId: 'location-1' } }, world: { 'location-1': {}, 'location-2': {} } },
      turn: true,
      expectedState: { parties: { 'test-party': { locationId: 'location-2' } } }
    });

    test({
      testName: 'should decrease progress counter when not finished',
      initState: { activities: { 'test-activity-id': { id: 'test-activity-id', type: WorldActivity.Travel, state: { progress: 2 } as any, } } },
      turn: true,
      expectedState: { activities: { 'test-activity-id': { type: WorldActivity.Travel, state: { progress: 1 } as any, } } }
    });

    test({
      testName: 'should remove old activity on finish',
      initState: { activities: { 'test-activity-id': { id: 'test-activity-id', type: WorldActivity.Travel, state: { progress: 1 } as any, } } },
      turn: true,
      expectedState: state => expect(state.activities).not.toHaveProperty('test-activity-id')
    });
  })
});
