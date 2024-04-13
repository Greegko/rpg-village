import { BlacksmithCommand } from "@rpg-village/core";
import { AttackEffectType, EffectType, EquipmentSlot } from "@rpg-village/core";

import { createState, test } from "../../../../utils";

test("should give new dmg effect", {
  initState: createState(({ unit, party }) => [
    party({
      stash: { resource: { gold: 50 } },
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
      args: { unitId: "target-unit", itemId: "test-item" },
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

test("should use party gold for upgrade", {
  initState: createState(({ unit, party }) => [
    party({
      id: "partyId",
      stash: { resource: { gold: 50 }, items: [] },
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
      args: { unitId: "target-unit", itemId: "test-item" },
    },
  ],
  expectedState: { parties: { partyId: { stash: { resource: { gold: 0 }, items: [] } } } },
});

test("should upgrade item on hero equipment", {
  initState: createState(({ unit, party }) => [
    party({
      stash: { resource: { gold: 50 } },
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
