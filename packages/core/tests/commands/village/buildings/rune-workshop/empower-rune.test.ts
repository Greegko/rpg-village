import { ItemType } from "@rpg-village/core/features/item";
import { RuneWorkshopCommand } from "@rpg-village/core/features/village";

import { createState, test } from "../../../../utils";

test("should empower rune with soul", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { soul: 5 }, items: [{ id: "rune", itemType: ItemType.Rune, soul: 1 }] },
    }),
  ]),
  commands: [
    {
      command: RuneWorkshopCommand.EmpowerRune,
      args: {
        villageId: "villageId",
        runeId: "rune",
        soul: 1,
      },
    },
  ],
  expectedState: {
    villages: {
      villageId: { stash: { resource: { soul: 4 }, items: [{ id: "rune", itemType: ItemType.Rune, soul: 2 }] } },
    },
  },
});
