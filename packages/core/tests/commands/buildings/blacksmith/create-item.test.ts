import { test, createState } from "../../../utils";
import { BlacksmithCommand, ItemType } from "../../../../public-api";

test("should create shield item", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { itemType: ItemType.Armor },
    },
  ],
  expectedState: (state, t) => t.is(state.village.stash.items[0].itemType, ItemType.Armor),
});

test("should cost 50 gold", {
  initState: createState(({ village }) => [village({ stash: { resource: { gold: 50 }, items: [] } })]),
  commands: [
    {
      command: BlacksmithCommand.CreateItem,
      args: { itemType: ItemType.Armor },
    },
  ],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
