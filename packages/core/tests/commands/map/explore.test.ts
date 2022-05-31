import { test, createState } from "../../utils";
import { MapCommand, MapActivity } from "../../../public-api";
import { values } from "ramda";

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

test("should explore the target tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["tile"] }),
    activity({
      startArgs: {
        partyId: party({
          id: "party-id",
          locationId: location({ id: "tile", explored: false }),
        }),
      },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: { mapLocations: { tile: { explored: true } } },
});

test("should explore neighbour tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["tile"] }),
    activity({
      startArgs: {
        partyId: party({
          id: "party-id",
          locationId: location({ id: "tile", explored: false }),
        }),
      },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.is(values(state.mapLocations).length, 7),
});

test("should only explore tiles in the same map", {
  initState: createState(({ location, party, activity, map }) => [
    map({
      id: "map-world",
      mapLocationIds: [location({ id: "map-world-location", explored: false })],
    }),
    map({
      id: "map-not-world",
      mapLocationIds: [location({ id: "map-non-world-location", explored: false })],
    }),
    activity({
      startArgs: {
        partyId: party({
          id: "party-id",
          locationId: "map-world-location",
        }),
      },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => {
    t.is(state.maps["map-world"].mapLocationIds.length, 7);
    t.is(state.maps["map-not-world"].mapLocationIds.length, 1);
  },
});
