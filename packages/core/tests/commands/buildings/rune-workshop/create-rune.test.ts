import { ItemType } from "@models";
import { RuneWorkshopCommand } from "@modules/village";

import { createState, test } from "../../../utils";

test("should create rune item", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.CreateRune,
    },
  ],
  expectedState: (state, t) => t.is(state.village.stash.items[0].itemType, ItemType.Rune),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.CreateRune,
    },
  ],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
