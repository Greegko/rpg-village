import { StashLocation } from "@features/village";
import { BlacksmithCommand } from "@features/village-buildings";
import { AttackEffectType, EffectType, EquipmentSlot } from "@models";

import { createState, test } from "../../../utils";

test("should give new dmg effect", {
  initState: createState(({ unit, village, party }) => [
    village({ stash: { resource: { gold: 50 } } }),
    party({
      unitIds: [
        unit({
          id: "target-unit",
          stash: { items: [{ id: "test-item", effects: [] }] },
        }),
      ],
    }),
  ]),
  commands: [
    {
      command: BlacksmithCommand.UpgradeItem,
      args: { unitId: "target-unit", itemId: "test-item", stash: StashLocation.Unit },
    },
  ],
  expectedState: {
    units: {
      "target-unit": {
        stash: {
          items: [
            { id: "test-item", effects: [{ type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 2 }] },
          ],
        },
      },
    },
  },
});

test("should use village gold for upgrade", {
  initState: createState(({ unit, village, party }) => [
    village({ stash: { resource: { gold: 50 } } }),
    party({
      unitIds: [
        unit({
          id: "target-unit",
          stash: { items: [{ id: "test-item", effects: [] }] },
        }),
      ],
    }),
  ]),
  commands: [
    {
      command: BlacksmithCommand.UpgradeItem,
      args: { unitId: "target-unit", itemId: "test-item", stash: StashLocation.Unit },
    },
  ],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});

test("should upgrade item on hero equipment", {
  initState: createState(({ unit, village, party }) => [
    village({ stash: { resource: { gold: 50 } } }),
    party({
      unitIds: [
        unit({
          id: "target-unit",
          equipment: { [EquipmentSlot.Torso]: { id: "test-item", effects: [] } },
        }),
      ],
    }),
  ]),
  commands: [
    {
      command: BlacksmithCommand.UpgradeItem,
      args: { unitId: "target-unit", itemId: "test-item" },
    },
  ],
  expectedState: {
    units: {
      "target-unit": {
        equipment: {
          [EquipmentSlot.Torso]: {
            id: "test-item",
            effects: [{ type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 2 }],
          },
        },
      },
    },
  },
});

test("should upgrade in village stash", {
  initState: createState(({ village, party }) => [
    village({ stash: { resource: { gold: 50 }, items: [{ id: "test-item", effects: [] }] } }),
  ]),
  commands: [
    {
      command: BlacksmithCommand.UpgradeItem,
      args: { itemId: "test-item", stash: StashLocation.Village },
    },
  ],
  expectedState: {
    village: {
      stash: {
        items: [
          { id: "test-item", effects: [{ type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 2 }] },
        ],
      },
    },
  },
});
