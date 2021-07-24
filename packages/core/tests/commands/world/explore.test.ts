import { test, createState } from "../../utils";
import { WorldCommand, WorldActivity } from "../../../public-api";

test("should start Explore activity", {
  initState: createState(({ location, party }) => [
    party({
      id: "party",
      locationId: location({ id: "unexplored-tile", explored: false }),
    }),
  ]),
  commands: [{ command: WorldCommand.Explore, args: { partyId: "party" } }],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, {
      name: WorldActivity.Explore,
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
  commands: [{ command: WorldCommand.Explore, args: { partyId: "party" } }],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});
