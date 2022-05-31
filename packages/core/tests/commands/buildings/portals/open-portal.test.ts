import { createState, test } from "../../../utils";

import { ItemType, PortalsCommand } from "../../../../public-api";

test("should create portal", {
  initState: createState(({ village, map }) => [
    map({ mapLocationIds: ["village-location"] }),
    village({
      locationId: "village-location",
      stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] },
    }),
  ]),
  commands: [
    {
      command: PortalsCommand.OpenPortal,
      args: { dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: (state, t) => t.length(state.maps, 2),
});

test("should consume dungeon key", {
  initState: createState(({ village }) => [
    village({ stash: { items: [{ itemType: ItemType.DungeonKey, id: "dungeon-key" }] } }),
  ]),
  commands: [
    {
      command: PortalsCommand.OpenPortal,
      args: { dungeonKeyId: "dungeon-key" },
    },
  ],
  expectedState: { village: { stash: { items: [] } } },
});
