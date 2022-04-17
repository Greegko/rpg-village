import { test, createState } from "../../utils";
import { MapCommand, MapActivity } from "../../../public-api";
import { filter, propEq, values } from "ramda";

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
  initState: createState(({ location, party, activity }) => [
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
  expectedState: { map: { tile: { explored: true } } },
});

test("should explore neighbour tiles", {
  initState: createState(({ location, party, activity }) => [
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
  expectedState: (state, t) => t.is(values(state.map).length, 7),
});

test("should only explore tiles in the same map", {
  initState: createState(({ location, party, activity }) => [
    activity({
      startArgs: {
        partyId: party({
          id: "party-id",
          locationId: location({ explored: false, mapId: "map-world" }),
        }),
      },
      name: MapActivity.Explore,
      state: { progress: 1, partyId: "party-id" },
    }),
    location({ explored: false, mapId: "map-1" }),
  ]),
  turn: true,
  expectedState: (state, t) => t.is(filter(propEq("mapId", "map-1"), values(state.map)).length, 1),
});
