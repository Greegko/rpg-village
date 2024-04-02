import { MapActivity } from "@features/map";

import { createState, stashFactory, test } from "../../utils";

test("should move party to the new location on finish", {
  initState: createState(({ party, activity, location }) => [
    location({ id: "test", partyIds: ["test-party-id"] }),
    activity({
      name: MapActivity.Travel,
      targetId: party({ id: "test-party-id" }),
      state: {
        progress: 1,
        targetLocationId: location({ id: "target-location" }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    mapLocations: { "target-location": { partyIds: ["test-party-id"] } },
  },
});

test("should store looted resource into village stash", {
  initState: createState(({ party, activity, location, village }) => [
    location({ id: "test", partyIds: ["test-party-id"] }),
    village({
      id: "villageId",
      locationId: "village-location-id",
      stash: stashFactory({ resource: { gold: 10, soul: 5 } }),
    }),
    activity({
      name: MapActivity.Travel,
      targetId: party({
        id: "test-party-id",
        stash: stashFactory({ resource: { gold: 5, soul: 1 } }),
      }),
      state: {
        progress: 1,
        targetLocationId: location({ id: "village-location-id" }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    villages: { villageId: { stash: { resource: { gold: 15, soul: 6 } } } },
    parties: { "test-party-id": { stash: { resource: { gold: 0, soul: 0 } } } },
  },
});
