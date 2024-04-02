import { BlacksmithCommand } from "@features/village/buildings";
import { ItemType } from "@models";

import { createState, test } from "../../../../utils";

test("should create shield item", {
  initState: createState(({ unit }) => [unit({ id: "unit-id", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { unitId: "unit-id", itemType: ItemType.Armor },
    },
  ],
  expectedState: (state, t) => t.is(state.units["unit-id"].stash.items[0].itemType, ItemType.Armor),
});

test("should cost 50 gold", {
  initState: createState(({ unit }) => [unit({ id: "unit-id", stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { unitId: "unit-id", itemType: ItemType.Armor },
    },
  ],
  expectedState: { units: { "unit-id": { stash: { resource: { gold: 0 } } } } },
});
