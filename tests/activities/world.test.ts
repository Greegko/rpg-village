import { test } from '../utils';
import { WorldActivity } from '../../src';

describe('World Activites', () => {
  describe('Travel', () => {
    test('should move party to the new location on finish', {
      initState: { activities: { 'test-activity-id': { type: WorldActivity.Travel, state: { partyId: 'test-party', progress: 1, targetLocationId: 'location-2' } as any, } }, parties: { 'test-party': { locationId: 'location-1' } }, world: { 'location-1': {}, 'location-2': {} } },
      turn: true,
      expectedState: { parties: { 'test-party': { locationId: 'location-2' } } }
    });
  });
});
