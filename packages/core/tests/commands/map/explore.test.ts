import { MapActivity, MapCommand } from "@modules/map";

import { createState, test } from "../../utils";

test("should start Explore activity", {
  initState: createState(({ location, party }) => [
    location({ id: "unexplored-tile", explored: false, partyIds: [party({ id: "party" })] }),
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
    location({ id: "tile", explored: true, partyIds: [party({ id: "party" })] }),
  ]),
  commands: [{ command: MapCommand.Explore, args: { partyId: "party" } }],
  expectedState: (state, t) => t.deepEqual(state.activities, {}),
});

test("should explore the target tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: [location({ id: "tile", partyIds: ["party-id"], explored: false })] }),
    activity({
      startArgs: { partyId: party({ id: "party-id" }) },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: { mapLocations: { tile: { explored: true } } },
});

test("should explore neighbour tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({
      mapLocationIds: [location({ id: "tile", explored: false, partyIds: [party({ id: "party-id" })] })],
    }),
    activity({
      startArgs: { partyId: "party-id" },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.length(state.mapLocations, 7),
});

test("should only explore tiles in the same map", {
  initState: createState(({ location, party, activity, map }) => [
    map({
      id: "map-world",
      mapLocationIds: [location({ id: "map-world-location", explored: false, partyIds: ["party-id"] })],
    }),
    map({
      id: "map-not-world",
      mapLocationIds: [location({ id: "map-non-world-location", explored: false })],
    }),
    activity({
      startArgs: { partyId: party({ id: "party-id" }) },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => {
    t.length(state.maps["map-world"].mapLocationIds, 7);
    t.length(state.maps["map-not-world"].mapLocationIds, 1);
  },
});
