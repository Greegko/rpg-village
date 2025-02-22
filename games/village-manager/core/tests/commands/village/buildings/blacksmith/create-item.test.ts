import { expect } from "vitest";

import { ItemType } from "@/features/item";
import { BlacksmithCommand } from "@/features/village";

import { createState, test } from "@test/utils";

test("should create shield item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { villageId: "villageId", itemType: ItemType.Armor },
    },
  ],
  expectedState: state => expect(state.villages["villageId"].stash.items[0].itemType).toBe(ItemType.Armor),
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
