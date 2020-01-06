import { UnitEvents, EquipmentPlace } from '../src';
import { eventTest } from './event-tests';
import { ItemType } from '../src/models/item/item-types';

describe('UnitEvents', () => {
  describe('Equip Item', () => {
    eventTest({
      testName: 'should be able to equip item',
      initState: { units: { "test": { equipment: {}, stash: { items: [{ id: 'item' }] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test", itemId: 'item', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test": { equipment: { [EquipmentPlace.Torso]: { id: "item" } } } } }
    });

    eventTest({
      testName: 'should remove item from the stash',
      initState: { units: { "test": { equipment: {}, stash: { items: [{ id: 'item' }] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test", itemId: 'item', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test": { stash: { items: [] } } } }
    });
  });

  describe('UnEquip Item', () => {
    eventTest({
      testName: 'should be able to un-equip item',
      initState: { units: { "test": { equipment: { [EquipmentPlace.Torso]: { id: 'item' } }, stash: { items: [] } } } },
      events: [{ event: UnitEvents.UnequipItem, args: { unitId: "test", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test": { equipment: {} } } }
    });

    eventTest({
      testName: 'should add un-equiped item to the stash',
      initState: { units: { "test": { equipment: { [EquipmentPlace.Torso]: { id: 'item' } }, stash: { items: [] } } } },
      events: [{ event: UnitEvents.UnequipItem, args: { unitId: "test", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test": { stash: { items: [{ id: "item" }] } } } }
    });
  });
});
