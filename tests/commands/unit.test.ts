import { UnitCommand, EquipmentPlace } from '../../src';
import { test } from '../utils';

describe('UnitCommand', () => {
  describe('Equip Item', () => {
    test({
      testName: 'should be able to equip item',
      initState: { units: { "test-hero-id": { equipment: {}, stash: { items: [{ id: 'test-item-id' }] } } } },
      commands: [{ command: UnitCommand.EquipItem, args: { unitId: "test-hero-id", itemId: 'test-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "test-item-id" } } } } }
    });

    test({
      testName: 'should remove item from the stash',
      initState: { units: { "test-hero-id": { equipment: {}, stash: { items: [{ id: 'test-item-id' }] } } } },
      commands: [{ command: UnitCommand.EquipItem, args: { unitId: "test-hero-id", itemId: 'test-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { stash: { items: [] } } } }
    });

    test({
      testName: 'should keep original on no available item id',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "stay" } }, stash: { items: [] } } } },
      commands: [{ command: UnitCommand.EquipItem, args: { unitId: "test-hero-id", itemId: 'missing-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "stay" } } } } }
    });

    test({
      testName: 'should unequip the current equipped item on same place target',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'equipped-item-id' } }, stash: { items: [{ id: 'new-item-id' }] } } } },
      commands: [{ command: UnitCommand.EquipItem, args: { unitId: "test-hero-id", itemId: 'new-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "new-item-id" } }, stash: { items: [{ id: 'equipped-item-id' }] } } } }
    });
  });

  describe('UnEquip Item', () => {
    test({
      testName: 'should be able to un-equip item',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'test-item-id' } }, stash: { items: [] } } } },
      commands: [{ command: UnitCommand.UnequipItem, args: { unitId: "test-hero-id", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: {} } } }
    });

    test({
      testName: 'should add un-equiped item to the stash',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'test-item-id' } }, stash: { items: [] } } } },
      commands: [{ command: UnitCommand.UnequipItem, args: { unitId: "test-hero-id", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { stash: { items: [{ id: "test-item-id" }] } } } }
    });
  });
});
