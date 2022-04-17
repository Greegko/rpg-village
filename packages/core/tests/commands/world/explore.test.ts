import { test, createState } from "../../utils";
import { MapCommand, MapActivity } from "../../../public-api";

test("should start Explore activity", {
  initState: createState(({ location, party }) => [
    party({
      id: "party",
      locationId: location({ id: "unexplored-tile", explored: false }),
    }),
  ]),
  commands: [{ command: MapCommand.Explore, args: { partyId: "party" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, {
      name: MapActivity.Explore,
      state: { partyId: "party" },
    }),
});

test("should not start Explore activity on explored location", {
  initState: createState(({ location, party }) => [
    party({
      id: "party",
      locationId: location({ id: "tile", explored: true }),
    }),
  ]),
  commands: [{ command: MapCommand.Explore, args: { partyId: "party" } }],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});
