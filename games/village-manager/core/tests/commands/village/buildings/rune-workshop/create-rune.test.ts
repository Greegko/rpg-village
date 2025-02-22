import { ItemType } from "@/features/item";
import { RuneWorkshopCommand } from "@/features/village";
import { createState, test } from "@test/utils";
import { expect } from "vitest";

test("should create rune item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.CreateRune,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: state => expect(state.villages.villageId.stash.items[0].itemType).toBe(ItemType.Rune),
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
