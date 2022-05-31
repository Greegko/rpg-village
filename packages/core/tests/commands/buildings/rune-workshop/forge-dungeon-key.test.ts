import { createState, test } from "../../../utils";

import { ItemType, RuneWorkshopCommand } from "../../../../public-api";

test("should create dungeon key item", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.ForgeDungeonKey,
    },
  ],
  expectedState: (state, t) => t.is(state.village.stash.items[0].itemType, ItemType.DungeonKey),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.ForgeDungeonKey,
    },
  ],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
