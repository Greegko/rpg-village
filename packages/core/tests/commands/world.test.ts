import { test, withRandomID, createState } from "../utils";
import * as expect from "expect";
import { PartyOwner, BattleActivityType, WorldCommand, WorldActivity } from "../../public-api";

describe("WorldCommand", () => {
  describe("Travel", () => {
    test("should start Travel activity", {
      initState: createState(({ location, party }) => [
        location({ id: "next-tile", x: 0, y: 1 }),
        party({ id: "party", locationId: location() }),
      ]),
      commands: [
        {
          command: WorldCommand.Travel,
          args: { targetLocationId: "next-tile", partyId: "party" },
        },
      ],
      expectedState: state =>
        withRandomID(state.activities, {
          name: WorldActivity.Travel,
          state: { partyId: "party" },
        }),
    });

    test("should not start Travel activity to same location", {
      initState: createState(({ location, party }) => [
        party({ id: "party", locationId: location({ id: "random-location" }) }),
      ]),
      commands: [
        {
          command: WorldCommand.Travel,
          args: { targetLocationId: "random-location", partyId: "party" },
        },
      ],
      expectedState: state => expect(state.activities).toEqual({}),
    });
  });

  describe("Explore", () => {
    test("should start Explore activity", {
      initState: createState(({ location, party }) => [
        party({
          id: "party",
          locationId: location({ id: "unexplored-tile", explored: false }),
        }),
      ]),
      commands: [{ command: WorldCommand.Explore, args: { partyId: "party" } }],
      expectedState: state =>
        withRandomID(state.activities, {
          name: WorldActivity.Explore,
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
      commands: [{ command: WorldCommand.Explore, args: { partyId: "party" } }],
      expectedState: state => expect(state.activities).toEqual({}),
    });
  });

  describe("Battle", () => {
    test("should start Battle activity", {
      initState: createState(({ party, unit, location }) => [
        party({
          id: "party-x",
          locationId: location({ id: "battle-location" }),
          unitIds: [unit({ hp: 50 })],
          owner: PartyOwner.Player,
        }),
        party({
          id: "party-y",
          locationId: location({ id: "battle-location" }),
          unitIds: [unit({ hp: 50 })],
          owner: PartyOwner.Enemy,
        }),
      ]),
      commands: [
        {
          command: WorldCommand.Battle,
          args: { locationId: "battle-location" },
        },
      ],
      expectedState: state => {
        withRandomID(state.activities, { name: BattleActivityType.Battle });
        withRandomID(state.battle, {
          partyId: "party-x",
          defenderPartyId: "party-y",
        });
      },
    });
  });
});
