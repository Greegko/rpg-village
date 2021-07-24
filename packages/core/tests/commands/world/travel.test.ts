import { test, createState } from "../../utils";
import { WorldCommand, WorldActivity } from "../../../public-api";

test("should start Travel activity", {
  initState: createState(({ location, party }) => [
    location({ id: "next-tile", x: 0, y: 1 }),
    party({ id: "party", locationId: location() }),
  ]),
  commands: [
    {
      command: WorldCommand.Travel,
      args: { targetLocationId: "next-tile", partyId: "party" },
    },
  ],
  expectedState: (state, t) =>
    t.withRandomId(state.activities, {
      name: WorldActivity.Travel,
      state: { partyId: "party" },
    }),
});

test("should not start Travel activity to same location", {
  initState: createState(({ location, party }) => [
    party({ id: "party", locationId: location({ id: "random-location" }) }),
  ]),
  commands: [
    {
      command: WorldCommand.Travel,
      args: { targetLocationId: "random-location", partyId: "party" },
    },
  ],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});
