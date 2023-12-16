import { values } from "rambda";

import { PortalCommand } from "@features/village-buildings";
import { AttackEffectType, EffectType, ItemType } from "@models";

import { createState, staticEffectFactory, test } from "../../../utils";

test("should create portal", {
  initState: createState(({ village, map }) => [
    map({ mapLocationIds: ["village-location"] }),
    village({
      locationId: "village-location",
      stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] },
    }),
  ]),
  commands: [
    {
      command: PortalCommand.OpenPortal,
      args: { dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: (state, t) => t.length(state.maps, 2),
});

test("should apply effects to the portal", {
  initState: createState(({ village, map }) => [
    map({ id: "global-map", mapLocationIds: ["village-location"] }),
    village({
      locationId: "village-location",
      stash: {
        items: [
          {
            itemType: ItemType.DungeonKey,
            id: "dungeon-key",
            effects: [staticEffectFactory({ effectType: AttackEffectType.Dmg, value: 10, isPercentage: false })],
          },
        ],
      },
    }),
  ]),
  commands: [
    {
      command: PortalCommand.OpenPortal,
      args: { dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: (state, t) =>
    t.deepEqual(values(state.maps).find(x => x.id !== "global-map").modifiers, [
      { type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 10, isPercentage: false },
    ]),
});

test("should consume dungeon key", {
  initState: createState(({ village }) => [
    village({ stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] } }),
  ]),
  commands: [
    {
      command: PortalCommand.OpenPortal,
      args: { dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: { village: { stash: { items: [] } } },
});
