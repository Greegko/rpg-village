import { test, createState } from "../../utils";
import { MapCommand, MapActivity } from "../../../public-api";

test("should start Travel activity", {
  initState: createState(({ location, party }) => [
    location({ id: "next-tile", x: 0, y: 1 }),
    party({ id: "party", locationId: location() }),
  ]),
  commands: [
    {
      command: MapCommand.Travel,
      args: { targetLocationId: "next-tile", partyId: "party" },
    },
  ],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, {
      name: MapActivity.Travel,
      state: { partyId: "party" },
    }),
});

test("should not start Travel activity to same location", {
  initState: createState(({ location, party }) => [
    party({ id: "party", locationId: location({ id: "random-location" }) }),
  ]),
  commands: [
    {
      command: MapCommand.Travel,
      args: { targetLocationId: "random-location", partyId: "party" },
    },
  ],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});
