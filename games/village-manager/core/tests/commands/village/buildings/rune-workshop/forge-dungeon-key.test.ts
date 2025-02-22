import { expect } from "vitest";

import { ItemType } from "@/features/item";
import { RuneWorkshopCommand } from "@/features/village";

import { createState } from "@test/utils/create-state";
import { test } from "@test/utils/test";

test("should create dungeon key item", {
  initState: createState(({ village }) => [village({ id: "villageId", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.ForgeDungeonKey,
      args: { villageId: "villageId" },
    },
  ],
  expectedState: state => expect(state.villages.villageId.stash.items[0].itemType).toBe(ItemType.DungeonKey),
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
