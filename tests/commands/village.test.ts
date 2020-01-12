import { VillageCommand } from '../../src';
import { test } from '../utils';
import * as expect from 'expect';

describe('VillageCommand', () => {
  describe('GenerateGold', () => {
    test({
      testName: 'should generate 5 gold pieces',
      initState: { village: { stash: { resource: { gold: 20 } } } },
      commands: [VillageCommand.GenerateGold],
      expectedState: { village: { stash: { resource: { gold: 25 } } } }
    });
  });

  describe('Buildhouse', () => {
    const initState = { village: { stash: { resource: { gold: 20 } }, houses: 0 } };
    test({
      testName: 'should build a house',
      initState,
      commands: [VillageCommand.BuildHouse],
      expectedState: { village: { houses: 1 } }
    });

    test({
      testName: 'should reduce the village resouce by the house cost',
      initState,
      commands: [VillageCommand.BuildHouse],
      expectedState: { village: { stash: { resource: { gold: 0 } } } }
    });
  })

  describe('HireHero', () => {
    const initState = { village: { stash: { resource: { gold: 25 } }, houses: 1, heroes: [] } };

    test({
      testName: 'should reduce village gold capacity by cost amount',
      initState,
      commands: [VillageCommand.HireHero],
      expectedState: { village: { stash: { resource: { gold: 5 } } } }
    });

    test({
      testName: 'should add to village heroes list',
      initState,
      commands: [VillageCommand.HireHero],
      expectedState: state => expect(state.village.heroes).not.toEqual([])
    });

    test({
      testName: 'should store in units list',
      initState,
      commands: [VillageCommand.HireHero],
      expectedState: state => expect(state.units).not.toEqual({})
    });

    test({
      testName: 'should assign to a new party',
      initState,
      commands: [VillageCommand.HireHero],
      expectedState: state => expect(state.parties).not.toEqual({})
    });
  });
});
