import { values } from "rambda";
import { expect } from "vitest";

import { AttackEffectType, EffectType } from "@/features/effect";
import { ItemType } from "@/features/item";
import { VillageBuildingCommand } from "@/features/village";

import { createState, staticEffectFactory, test } from "@test/utils";

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
  expectedState: state => expect(state.maps).objectHaveKeys(2),
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
  expectedState: state =>
    expect(values(state.maps).find(x => x.id !== "global-map")!.modifiers).toEqual([
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
