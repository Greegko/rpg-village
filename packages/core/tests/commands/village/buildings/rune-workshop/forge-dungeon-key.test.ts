import { ItemType } from "@rpg-village/core";
import { RuneWorkshopCommand } from "@rpg-village/core/features/village";

import { createState, test } from "../../../../utils";

test("should create dungeon key item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.ForgeDungeonKey,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: (state, t) => t.is(state.villages.villageId.stash.items[0].itemType, ItemType.DungeonKey),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.ForgeDungeonKey,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
