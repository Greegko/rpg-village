import { test, createState } from "../../utils";
import { BlacksmithCommand, AttackEffectType } from "../../../src";

describe('Buildings - Blacksmith', () => {
  describe('Upgrade item', () => {
    test('should give new dmg effect', {
      initState: createState(({ unit, village, party }) => [
        party({
          locationId: village({ stash: { resource: { gold: 50 } } }),
          unitIds: [unit({ id: 'target-unit', stash: { items: [{ id: 'test-item', effects: [] }] } })]
        })
      ]),
      commands: [{ command: BlacksmithCommand.UpgradeItem, args: { unitId: 'target-unit', itemId: 'test-item' } }],
      expectedState: { units: { 'target-unit': { stash: { items: [{ effects: [{ type: AttackEffectType.Dmg }] }] } } } },
    });

    test('should use village gold for upgrade', {
      initState: createState(({ unit, village, party }) => [
        party({
          locationId: village({ stash: { resource: { gold: 50 } } }),
          unitIds: [unit({ id: 'target-unit', stash: { items: [{ id: 'test-item', effects: [] }] } })]
        })
      ]),
      commands: [{ command: BlacksmithCommand.UpgradeItem, args: { unitId: 'target-unit', itemId: 'test-item' } }],
      expectedState: { village: { stash: { resource: { gold: 0 } } } },
    });
  });
});