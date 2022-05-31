import { test, createState } from "../../utils";
import { MapActivity } from "../../../public-api";

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
