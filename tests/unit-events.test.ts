import { UnitEvents, EquipmentPlace } from '../src';
import { eventTest } from './event-tests';

describe('UnitEvents', () => {
  describe('Equip Item', () => {
    eventTest({
      testName: 'should be able to equip item',
      initState: { units: { "test-hero-id": { equipment: {}, stash: { items: [{ id: 'test-item-id' }] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test-hero-id", itemId: 'test-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "test-item-id" } } } } }
    });

    eventTest({
      testName: 'should remove item from the stash',
      initState: { units: { "test-hero-id": { equipment: {}, stash: { items: [{ id: 'test-item-id' }] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test-hero-id", itemId: 'test-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { stash: { items: [] } } } }
    });

    eventTest({
      testName: 'should keep original on no available item id',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "stay" } }, stash: { items: [] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test-hero-id", itemId: 'missing-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "stay" } } } } }
    });

    eventTest({
      testName: 'should unequip the current equipped item on same place target',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'equipped-item-id' } }, stash: { items: [{ id: 'new-item-id' }] } } } },
      events: [{ event: UnitEvents.EquipItem, args: { unitId: "test-hero-id", itemId: 'new-item-id', place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: "new-item-id" } }, stash: { items: [{ id: 'equipped-item-id' }] } } } }
    });
  });

  describe('UnEquip Item', () => {
    eventTest({
      testName: 'should be able to un-equip item',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'test-item-id' } }, stash: { items: [] } } } },
      events: [{ event: UnitEvents.UnequipItem, args: { unitId: "test-hero-id", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { equipment: {} } } }
    });

    eventTest({
      testName: 'should add un-equiped item to the stash',
      initState: { units: { "test-hero-id": { equipment: { [EquipmentPlace.Torso]: { id: 'test-item-id' } }, stash: { items: [] } } } },
      events: [{ event: UnitEvents.UnequipItem, args: { unitId: "test-hero-id", place: EquipmentPlace.Torso } }],
      expectedState: { units: { "test-hero-id": { stash: { items: [{ id: "test-item-id" }] } } } }
    });
  });
});
