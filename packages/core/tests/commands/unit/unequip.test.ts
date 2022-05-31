import { test } from "../../utils";

import { EquipmentSlot, UnitCommand } from "../../../public-api";

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
      args: { unitId: "test-hero-id", slot: EquipmentSlot.Torso },
    },
  ],
  expectedState: { units: { "test-hero-id": { equipment: {} } } },
});

test("should add un-equiped item to the stash", {
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
      args: { unitId: "test-hero-id", slot: EquipmentSlot.Torso },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": { stash: { items: [{ id: "test-item-id" }] } },
    },
  },
});
