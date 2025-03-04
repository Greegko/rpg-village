import { ItemType } from "@/features/item";
import { RuneWorkshopCommand } from "@/features/village";
import { createState, test } from "@test/utils";

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
