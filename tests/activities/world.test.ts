import { test, withRandomID, createState, stashFactory } from '../utils';
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

    describe('Village target location', () => {
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

      test('should store looted resource into village stash', {
        initState: createState(({ party, activity, location, village }) => [
          activity({
            type: WorldActivity.Travel,
            state: {
              partyId: party({ id: 'test-party-id', locationId: location(), stash: stashFactory({ resource: { gold: 5 } }) }),
              progress: 1,
              targetLocationId: village({ stash: stashFactory({ resource: { gold: 10 } }) })
            }
          }),
        ]),
        turn: true,
        expectedState: { village: { stash: { resource: { gold: 15 } } }, parties: { 'test-party-id': { stash: { resource: { gold: 0 } } } } },
      });
    })
  });
});
