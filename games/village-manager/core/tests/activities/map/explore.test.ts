import { MapActivity, MapLocationType } from "@/features/map";
import { createState, test } from "@test/utils";
import { values } from "rambda";
import { expect } from "vitest";

test("should change explore status on tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: [location({ id: "tile", partyIds: ["party"], explored: false })] }),
    activity({
      name: MapActivity.Explore,
      targetId: party({ id: "party" }),
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: { mapLocations: { tile: { explored: true } } },
});

test("should add new locations around explored tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: [location({ id: "tile", partyIds: ["party"], explored: false })] }),
    activity({
      name: MapActivity.Explore,
      targetId: party({ id: "party" }),
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: state => expect(state.mapLocations).objectHaveKeys(7),
});

test("should add enemy units on new map tile", {
  initState: createState(({ location, party, activity, map }) => [
    map({ mapLocationIds: [location({ id: "tile", partyIds: ["party"], explored: false })] }),
    activity({
      name: MapActivity.Explore,
      targetId: party({ id: "party" }),
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: state => expect(state.units).objectHaveKeys(6),
});

test("should spawn empty tiles after boss tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({
      mapLocationIds: [location({ id: "boss-tile", partyIds: ["party"], explored: false, type: MapLocationType.Boss })],
    }),
    activity({
      name: MapActivity.Explore,
      targetId: party({ id: "party" }),
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: [
    state => expect(state.mapLocations).objectHaveKeys(7),
    state => expect(values(state.mapLocations).filter(x => x.type === MapLocationType.Boss)).objectHaveKeys(1),
    state => expect(values(state.mapLocations).filter(x => x.type === MapLocationType.Empty)).objectHaveKeys(6),
  ],
});

test("should not add enemies on empty tiles", {
  initState: createState(({ location, party, activity, map }) => [
    map({
      mapLocationIds: [location({ id: "boss-tile", partyIds: ["party"], explored: false, type: MapLocationType.Boss })],
    }),
    activity({
      name: MapActivity.Explore,
      targetId: party({ id: "party" }),
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: state => expect(state.units).objectHaveKeys(0),
});
