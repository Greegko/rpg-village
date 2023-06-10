import { BattleActivityType } from "@features/battle";
import { UnitType } from "@features/unit";
import { AttackEffectType, EffectType, ItemType, RuneAttackEffectType } from "@models";
import { VillageConfig } from "@modules/village";

import { createState, test } from "../utils";
import { equipmentFactory, runeFactory } from "../utils/factories";

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
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.falsy(state.activities.battleActivity),
});

test("should gain xp for winner heroes", {
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
                level: 1,
                type: UnitType.Hero,
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "winner-unit": { xp: 25 } } },
});

test("should gain gold", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "party-id",
            unitIds: [unit({ dmg: 100, hp: 100 })],
            stash: { resource: { gold: 0 } },
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { parties: { "party-id": { stash: { resource: { gold: 25 } } } } },
});

test("should gain soul", {
  initState: createState(({ activity, party, unit, battle }) => [
    activity({
      name: BattleActivityType.Battle,
      state: {
        battleId: battle({
          partyId: party({
            id: "party-id",
            unitIds: [unit({ dmg: 100, hp: 100 })],
            stash: { resource: { soul: 5 } },
          }),
          defenderPartyId: party({
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { parties: { "party-id": { stash: { resource: { soul: 6 } } } } },
});

test("should gain resource into village when enabled VillageConfig.DirectLootToVillage config", {
  gameConfig: { [VillageConfig.DirectLootToVillage]: true },
  initState: createState(({ activity, party, unit, battle, village }) => [
    village({ stash: { resource: { gold: 0 } } }),
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
            unitIds: [unit({ dmg: 1, hp: 1, level: 1, armor: 0 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: {
    parties: { "winner-party": { stash: { resource: { gold: 0 } } } },
    village: { stash: { resource: { gold: 25 } } },
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
                  rightHand: equipmentFactory({
                    itemType: ItemType.Weapon,
                    effects: [{ value: 10, type: EffectType.Static, effectType: AttackEffectType.Dmg }],
                  }),
                },
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ id: "defender-unit", dmg: 1, hp: 25, armor: 0, maxhp: 25 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "defender-unit": { hp: 5 } } },
});

test("should apply percentage item dmg effect", {
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
                  rightHand: equipmentFactory({
                    itemType: ItemType.Weapon,
                    effects: [
                      { value: 10, type: EffectType.Static, isPercentage: true, effectType: AttackEffectType.Dmg },
                    ],
                  }),
                },
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ id: "defender-unit", dmg: 1, hp: 25, armor: 0, maxhp: 25 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "defender-unit": { hp: 14 } } },
});

test("should apply dynamic item effects", {
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
                  rune: runeFactory({
                    power: 100,
                    soul: 0,
                    effects: [{ type: EffectType.Dynamic, effectType: RuneAttackEffectType.Dmg }],
                  }),
                },
              }),
            ],
          }),
          defenderPartyId: party({
            unitIds: [unit({ id: "defender-unit", dmg: 1, hp: 200, armor: 0, maxhp: 200 })],
          }),
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "defender-unit": { hp: 90 } } },
});
