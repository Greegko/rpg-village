import { ItemType } from "@rpg-village/village-manager/features/item";
import { BlacksmithCommand } from "@rpg-village/village-manager/features/village";

import { createState, test } from "../../../../../tests/utils";

test("should create shield item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { villageId: "villageId", itemType: ItemType.Armor },
    },
  ],
  expectedState: (state, t) => t.is(state.villages["villageId"].stash.items[0].itemType, ItemType.Armor),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { villageId: "villageId", itemType: ItemType.Armor },
    },
  ],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 0 } } } } },
});
