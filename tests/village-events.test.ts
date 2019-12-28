import { VillageEvents } from '../src';
import { eventTest } from './event-tests';
import * as expect from 'expect';

describe('VillageEvents', () => {
  describe('GenerateGold', () => {
    eventTest({
      testName: 'should generate 5 gold pieces',
      initState: { village: { stash: { resource: { gold: 20 } } } },
      events: [VillageEvents.GenerateGold],
      expectedState: { village: { stash: { resource: { gold: 25 } } } }
    });
  });

  describe('Buildhouse', () => {
    const initState = { village: { stash: { resource: { gold: 20 } }, houses: 0 } };
    eventTest({
      testName: 'should build a house',
      initState,
      events: [VillageEvents.BuildHouse],
      expectedState: { village: { houses: 1 } }
    }
    );

    eventTest({
      testName: 'should reduce the village resouce by the house cost',
      initState,
      events: [VillageEvents.BuildHouse],
      expectedState: { village: { stash: { resource: { gold: 0 } } } }
    });
  })

  describe('HireHero', () => {
    const initState = { village: { stash: { resource: { gold: 25 } }, houses: 1, heroes: [] } };

    eventTest({
      testName: 'should reduce village gold capacity by cost amount',
      initState,
      events: [VillageEvents.HireHero],
      expectedState: { village: { stash: { resource: { gold: 5 } } } }
    });

    eventTest({
      testName: 'should add to village heroes list',
      initState,
      events: [VillageEvents.HireHero],
      expectedState: state => expect(state.village.heroes).not.toEqual([])
    });

    eventTest({
      testName: 'should store in units list',
      initState,
      events: [VillageEvents.HireHero],
      expectedState: state => expect(state.units).not.toEqual({})
    });

    eventTest({
      testName: 'should assign to a new party',
      initState,
      events: [VillageEvents.HireHero],
      expectedState: state => expect(state.parties).not.toEqual({})
    });
  });
});
