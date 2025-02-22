import { EquipmentSlot, UnitCommand } from "@/features/unit";
import { test } from "@test/utils";

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
      args: { unitId: "test-hero-id", itemId: "test-item-id" },
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
      args: { unitId: "test-hero-id", itemId: "test-item-id" },
    },
  ],
  expectedState: {
    units: {
      "test-hero-id": { stash: { items: [{ id: "test-item-id" }] } },
    },
  },
});
