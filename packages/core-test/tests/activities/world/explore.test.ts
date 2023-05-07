import { values } from "rambda";

import { MapActivity, MapLocationType } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should change explore status on tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["tile"] }),
    activity({
      name: MapActivity.Explore,
      state: {
        partyId: party({
          id: "party",
          locationId: location({ id: "tile", explored: false }),
        }),
        progress: 1,
      },
    }),
  ]),
  turn: true,
  expectedState: { mapLocations: { tile: { explored: true } } },
});

test("should add new locations around explored tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["tile"] }),
    activity({
      name: MapActivity.Explore,
      state: {
        partyId: party({
          id: "party",
          locationId: location({ id: "tile", explored: false }),
        }),
        progress: 1,
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.length(state.mapLocations, 7),
});

test("should add enemy units on new map tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["tile"] }),
    activity({
      name: MapActivity.Explore,
      state: {
        partyId: party({
          id: "party",
          locationId: location({ id: "tile", explored: false }),
        }),
        progress: 1,
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.length(state.units, 6),
});

test("should spawn empty tiles after boss tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["boss-tile"] }),
    activity({
      name: MapActivity.Explore,
      state: {
        partyId: party({
          id: "party",
          locationId: location({ id: "boss-tile", explored: false, type: MapLocationType.Boss }),
        }),
        progress: 1,
      },
    }),
  ]),
  turn: true,
  expectedState: [
    (state, t) => t.length(state.mapLocations, 7),
    (state, t) =>
      t.length(
        values(state.mapLocations).filter(x => x.type === MapLocationType.Boss),
        1,
      ),
    (state, t) =>
      t.length(
        values(state.mapLocations).filter(x => x.type === MapLocationType.Empty),
        6,
      ),
  ],
});

test("should not add enemies on empty tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: ["boss-tile"] }),
    activity({
      name: MapActivity.Explore,
      state: {
        partyId: party({
          id: "party",
          locationId: location({ id: "boss-tile", explored: false, type: MapLocationType.Boss }),
        }),
        progress: 1,
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.length(state.units, 0),
});
