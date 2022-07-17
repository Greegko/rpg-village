import { test } from "../../utils";

import { EquipmentSlot, StashLocation, UnitCommand } from "../../../public-api";

test("should be able to un-equip item", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "test-item-id" } },
        stash: { items: [] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.UnequipItem,
      args: { unitId: "test-hero-id", itemId: "test-item-id", stash: StashLocation.Unit },
    },
  ],
  expectedState: { units: { "test-hero-id": { equipment: {} } } },
});

test("should add un-equiped item to the unit stash", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "test-item-id" } },
        stash: { items: [] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.UnequipItem,
      args: { unitId: "test-hero-id", itemId: "test-item-id", stash: StashLocation.Unit },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": { stash: { items: [{ id: "test-item-id" }] } },
    },
  },
});

test("should add un-equiped item to the village stash", {
  initState: {
    units: {
      "test-hero-id": {
        equipment: { [EquipmentSlot.Torso]: { id: "test-item-id" } },
        stash: { items: [] },
      },
    },
  },
  commands: [
    {
      command: UnitCommand.UnequipItem,
      args: { unitId: "test-hero-id", itemId: "test-item-id", stash: StashLocation.Village },
    },
  ],
  expectedState: {
    village: {
      stash: { items: [{ id: "test-item-id" }] },
    },
  },
});
