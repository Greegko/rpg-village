import { createState, test } from "../../utils";
import { stashFactory } from "../../utils/factories";

import { MapActivity } from "../../../public-api";

test("should move party to the new location on finish", {
  initState: createState(({ party, activity, location }) => [
    activity({
      name: MapActivity.Travel,
      state: {
        partyId: party({ id: "test-party-id", locationId: location() }),
        progress: 1,
        targetLocationId: location({ id: "target-location" }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    parties: { "test-party-id": { locationId: "target-location" } },
  },
});

test("should store looted resource into village stash", {
  initState: createState(({ party, activity, location, village }) => [
    activity({
      name: MapActivity.Travel,
      state: {
        partyId: party({
          id: "test-party-id",
          locationId: location(),
          stash: stashFactory({ resource: { gold: 5 } }),
        }),
        progress: 1,
        targetLocationId: village({
          stash: stashFactory({ resource: { gold: 10 } }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    village: { stash: { resource: { gold: 15 } } },
    parties: { "test-party-id": { stash: { resource: { gold: 0 } } } },
  },
});
