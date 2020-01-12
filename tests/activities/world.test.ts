import { test, withRandomID, createState } from '../utils';
import { WorldActivity, VillageActivity } from '../../src';

describe('World Activites', () => {
  describe('Travel', () => {
    test('should move party to the new location on finish', {
      initState: createState(({ party, activity, location }) => [
        activity({
          type: WorldActivity.Travel,
          state: {
            partyId: party({ id: 'test-party-id', locationId: location() }),
            progress: 1,
            targetLocationId: location({ id: 'target-location' })
          }
        }),
      ]),
      turn: true,
      expectedState: { parties: { 'test-party-id': { locationId: 'target-location' } } }
    });

    test('should start heal activity when arriving on village with wounded hero', {
      initState: createState(({ party, activity, location, village, unit }) => [
        activity({
          type: WorldActivity.Travel,
          state: {
            partyId: party({ id: 'test-party-id', locationId: location(), unitIds: [unit({ hp: 50, maxhp: 100 })] }),
            progress: 1,
            targetLocationId: village()
          }
        }),
      ]),
      turn: true,
      expectedState: state => withRandomID(state.activities, { type: VillageActivity.Heal }),
    });
  });
});
