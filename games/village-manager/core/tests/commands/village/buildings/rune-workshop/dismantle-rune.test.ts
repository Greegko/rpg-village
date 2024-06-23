import { ItemType } from "@rpg-village/village-manager/features/item";
import { RuneWorkshopCommand } from "@rpg-village/village-manager/features/village";

import { createState, test } from "../../../../../tests/utils";

test("should empower rune with soul", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { soul: 5 }, items: [{ id: "rune", itemType: ItemType.Rune, soul: 2 }] },
    }),
  ]),
  commands: [
    {
      command: RuneWorkshopCommand.DismantleRune,
      args: {
        villageId: "villageId",
        runeId: "rune",
      },
    },
  ],
  expectedState: { villages: { villageId: { stash: { resource: { soul: 7 }, items: [] } } } },
});
