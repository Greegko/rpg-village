import { createState, test } from "../../../utils";

import { AttackEffectType, BlacksmithCommand, StashLocation } from "../../../../public-api";

test("should give new dmg effect", {
  initState: createState(({ unit, village, party }) => [
    party({
      locationId: village({ stash: { resource: { gold: 50 } } }),
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
          items: [{ id: "test-item", effects: [{ type: AttackEffectType.Dmg, value: 2 }] }],
        },
      },
    },
  },
});

test("should use village gold for upgrade", {
  initState: createState(({ unit, village, party }) => [
    party({
      locationId: village({ stash: { resource: { gold: 50 } } }),
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
