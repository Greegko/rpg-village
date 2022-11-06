import { ItemType, RuneWorkshopCommand } from "@rpg-village/core";

import { createState, test } from "../../../utils";

test("should empower rune with soul", {
  initState: createState(({ village }) => [village({ stash: { resource: { soul: 5 }, items: [{ id: 'rune', itemType: ItemType.Rune, soul: 1 }] } })]),
  commands: [
    {
      command: RuneWorkshopCommand.EmpowerRune,
      args: {
        runeId: 'rune',
        soul: 1
      }
    },
  ],
  expectedState: { village: { stash: { resource: { soul: 4 }, items: [{ id: 'rune', itemType: ItemType.Rune, soul: 2 }] } } },
});
