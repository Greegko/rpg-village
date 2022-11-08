import { MapActivity } from "@rpg-village/core";

import { createState, stashFactory, test } from "../../utils";

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
          stash: stashFactory({ resource: { gold: 5, soul: 1 } }),
        }),
        progress: 1,
        targetLocationId: village({
          stash: stashFactory({ resource: { gold: 10, soul: 5 } }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    village: { stash: { resource: { gold: 15, soul: 6 } } },
    parties: { "test-party-id": { stash: { resource: { gold: 0, soul: 0 } } } },
  },
});