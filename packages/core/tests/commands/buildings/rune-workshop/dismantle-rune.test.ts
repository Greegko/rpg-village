import { RuneWorkshopCommand } from "@features/village-buildings";
import { ItemType } from "@models";

import { createState, test } from "../../../utils";

test("should empower rune with soul", {
  initState: createState(({ village }) => [
    village({ stash: { resource: { soul: 5 }, items: [{ id: "rune", itemType: ItemType.Rune, soul: 2 }] } }),
  ]),
  commands: [
    {
      command: RuneWorkshopCommand.DismantleRune,
      args: {
        runeId: "rune",
      },
    },
  ],
  expectedState: { village: { stash: { resource: { soul: 7 }, items: [] } } },
});
