import { createState, test } from "../utils";
import { equipmentFactory } from "../utils/factories";

import { AttackEffectType, BattleActivityType, ItemType, UnitType } from "../../public-api";

test("should finish correctly", {
  initState: createState(({ activity, party, unit, battle, map }) => [
    map({ mapLocationIds: ["locationId"] }),
    activity({
      id: "battleActivity",
      name: BattleActivityType.Battle,
      startArgs: {
        partyId: party({ id: "random-id" }),
      },
      state: {
        battleId: battle({
          partyId: party({
            id: "random-id",
            locationId: "locationId",
            unitIds: [unit({ dmg: 100, hp: 100 })],
          }),
          defenderPartyId: party({
            locationId: "locationId",
            unitIds: [unit({ dmg: 1, hp: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.falsy(state.activities.battleActivity),
});

test("should gain xp then winner heroes", {
  initState: createState(({ activity, party, unit, battle, map }) => [
    map({ mapLocationIds: ["locationId"] }),
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "party-id",
            locationId: "locationId",
            unitIds: [
              unit({
                id: "winner-unit",
                xp: 0,
                dmg: 100,
                hp: 100,
                level: 1,
                type: UnitType.Hero,
              }),
            ],
          }),
          defenderPartyId: party({
            locationId: "locationId",
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "winner-unit": { xp: 25 } } },
});

test("should party gain the looser stash", {
  initState: createState(({ activity, party, unit, battle, map, location }) => [
    map({ mapLocationIds: ["locationId"] }),
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            locationId: "locationId",
            id: "winner-party",
            unitIds: [unit({ dmg: 10, hp: 10 })],
            stash: { resource: { gold: 0 } },
          }),
          defenderPartyId: party({
            locationId: "locationId",
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
            stash: { resource: { gold: 25 } },
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    parties: { "winner-party": { stash: { resource: { gold: 25 } } } },
  },
});

test("should apply item dmg effect", {
  initState: createState(({ activity, party, unit, battle, map }) => [
    map({ mapLocationIds: ["locationId"] }),
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            locationId: "locationId",
            unitIds: [
              unit({
                dmg: 10,
                hp: 100,
                equipment: {
                  rightHand: equipmentFactory({
                    itemType: ItemType.Weapon,
                    effects: [{ value: 10, type: AttackEffectType.Dmg }],
                  }),
                },
              }),
            ],
          }),
          defenderPartyId: party({
            locationId: "locationId",
            unitIds: [unit({ id: "defender-unit", dmg: 1, hp: 25, armor: 0, maxhp: 25 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "defender-unit": { hp: 5 } } },
});
