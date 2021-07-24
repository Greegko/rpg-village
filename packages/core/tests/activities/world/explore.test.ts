import { test, createState } from "../../utils";
import { WorldActivity } from "../../../public-api";

test("should change explore status on tile", {
  initState: createState(({ location, party, activity }) => [
    activity({
      name: WorldActivity.Explore,
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
  expectedState: { world: { tile: { explored: true } } },
});

test("should add new locations around explored tile", {
  initState: createState(({ location, party, activity }) => [
    activity({
      name: WorldActivity.Explore,
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
  expectedState: (state, t) => t.is(Object.keys(state.world).length, 7),
});

test("should add enemy units on new map tile", {
  initState: createState(({ location, party, activity }) => [
    activity({
      name: WorldActivity.Explore,
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
  expectedState: (state, t) => t.is(Object.keys(state.units).length, 6),
});
