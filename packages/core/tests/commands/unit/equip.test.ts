import { test } from "../../utils";

import { EquipmentSlot, ItemType, StashLocation, UnitCommand } from "../../../public-api";

test("should be able to equip item", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: {},
        stash: { items: [{ id: "test-item-id", itemType: ItemType.Armor }] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.EquipItem,
      args: {
        unitId: "test-hero-id",
        itemId: "test-item-id",
        stash: StashLocation.Unit,
      },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "test-item-id", itemType: ItemType.Armor } },
      },
    },
  },
});

test("should remove item from the stash", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: {},
        stash: { items: [{ id: "test-item-id", itemType: ItemType.Armor }] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.EquipItem,
      args: {
        unitId: "test-hero-id",
        itemId: "test-item-id",
        stash: StashLocation.Unit,
      },
    },
  ],
  expectedState: { units: { "test-hero-id": { stash: { items: [] } } } },
});

test("should keep original on no available item id", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "stay" } },
        stash: { items: [] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.EquipItem,
      args: {
        unitId: "test-hero-id",
        itemId: "missing-item-id",
        stash: StashLocation.Unit,
      },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "stay" } },
      },
    },
  },
});

test("should unequip the current equipped item on same place target", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "equipped-item-id", itemType: ItemType.Armor } },
        stash: { items: [{ id: "new-item-id", itemType: ItemType.Armor }] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.EquipItem,
      args: {
        unitId: "test-hero-id",
        itemId: "new-item-id",
        stash: StashLocation.Unit,
      },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "new-item-id", itemType: ItemType.Armor } },
        stash: { items: [{ id: "equipped-item-id", itemType: ItemType.Armor }] },
      },
    },
  },
});
