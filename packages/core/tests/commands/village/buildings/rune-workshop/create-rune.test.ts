import { RuneWorkshopCommand } from "@features/village/buildings";
import { ItemType } from "@models";

import { createState, test } from "../../../../utils";

test("should create rune item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.CreateRune,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: (state, t) => t.is(state.villages.villageId.stash.items[0].itemType, ItemType.Rune),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.CreateRune,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
