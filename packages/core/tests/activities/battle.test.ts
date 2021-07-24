import { createState, test } from "../utils";
import { BattleActivityType, UnitType, ItemType, AttackEffectType } from "../../public-api";
import { itemFactory } from "../utils/factories";

test("should finish correctly", {
  initState: createState(({ activity, party, unit, battle }) => [
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
            unitIds: [unit({ dmg: 100, hp: 100 })],
          }),
          defenderPartyId: party({ unitIds: [unit({ dmg: 1, hp: 1 })] }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.falsy(state.activities.battleActivity),
});

test("should gain xp then winner heroes", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "party-id",
            unitIds: [
              unit({
                id: "winner-unit",
                xp: 0,
                dmg: 100,
                hp: 100,
                type: UnitType.Hero,
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "winner-unit": { xp: 25 } } },
});

test("should party gain gold", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "winner-party",
            unitIds: [unit({ dmg: 10, hp: 10 })],
            stash: { resource: { gold: 0 } },
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1 })],
            stash: { resource: { gold: 0 } },
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

test("should party gain the looser stash", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "winner-party",
            unitIds: [unit({ dmg: 10, hp: 10 })],
            stash: { resource: { gold: 0 } },
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1 })],
            stash: { resource: { gold: 25 } },
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    parties: { "winner-party": { stash: { resource: { gold: 50 } } } },
  },
});

test("should apply item dmg effect", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            unitIds: [
              unit({
                dmg: 10,
                hp: 100,
                equipment: {
                  rightHand: itemFactory({
                    itemType: ItemType.Weapon,
                    effects: [{ value: 10, type: AttackEffectType.Dmg }],
                  }),
                },
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ id: "defender-unit", dmg: 1, hp: 25 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "defender-unit": { hp: 5 } } },
});
