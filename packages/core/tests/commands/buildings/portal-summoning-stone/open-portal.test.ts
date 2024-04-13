import { VillageBuildingCommand } from "@rpg-village/core";
import { AttackEffectType, EffectType, ItemType } from "@rpg-village/core";
import { values } from "rambda";

import { createState, staticEffectFactory, test } from "../../../utils";

test("should create portal", {
  initState: createState(({ village, map }) => [
    map({ mapLocationIds: ["village-location"] }),
    village({
      id: "villageId",
      locationId: "village-location",
      stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] },
    }),
  ]),
  commands: [
    {
      command: VillageBuildingCommand.PortalSummoningStoneOpenPortal,
      args: { villageId: "villageId", dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: (state, t) => t.length(state.maps, 2),
});

test("should apply effects to the portal", {
  initState: createState(({ village, map }) => [
    map({ id: "global-map", mapLocationIds: ["village-location"] }),
    village({
      id: "villageId",
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
      command: VillageBuildingCommand.PortalSummoningStoneOpenPortal,
      args: { villageId: "villageId", dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: (state, t) =>
    t.deepEqual(values(state.maps).find(x => x.id !== "global-map")!.modifiers, [
      { type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 10, isPercentage: false },
    ]),
});

test("should consume dungeon key", {
  initState: createState(({ village }) => [
    village({ id: "villageId", stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] } }),
  ]),
  commands: [
    {
      command: VillageBuildingCommand.PortalSummoningStoneOpenPortal,
      args: { villageId: "villageId", dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: { villages: { villageId: { stash: { items: [] } } } },
});
