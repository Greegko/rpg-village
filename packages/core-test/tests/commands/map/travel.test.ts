import { MapActivity, MapCommand } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should start Travel activity", {
  initState: createState(({ location, party }) => [
    location({ partyIds: [party({ id: "party" })] }),
    location({ id: "next-tile", x: 0, y: 1 }),
  ]),
  commands: [{ command: MapCommand.Travel, args: { targetLocationId: "next-tile", partyId: "party" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, {
      name: MapActivity.Travel,
      state: { partyId: "party" },
    }),
});

test("should not start Travel activity to same location", {
  initState: createState(({ location, party }) => [
    location({ id: "random-location", partyIds: [party({ id: "party" })] }),
  ]),
  commands: [{ command: MapCommand.Travel, args: { targetLocationId: "random-location", partyId: "party" } }],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});
