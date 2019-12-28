import { VillageEvents } from '../src';
import { eventTest } from './event-tests';

describe('Village', () => {
  describe('VillageEvents', () => {
    eventTest({
      testName: 'GenerateGold',
      initState: { village: { stash: { resource: { gold: 20 } } } },
      events: [VillageEvents.GenerateGold],
      expectedState: { village: { stash: { resource: { gold: 25 } } } }
    });

    eventTest({
      testName: 'BuildHouse',
      initState: { village: { stash: { resource: { gold: 20 } }, houses: 0 } },
      events: [VillageEvents.BuildHouse],
      expectedState: { village: { stash: { resource: { gold: 0 } }, houses: 1 } }
    });
  });
});
