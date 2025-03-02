import { expect } from "vitest";

import { DmgType, DotEffect, EffectType } from "@/features/effect";

import {
  armorEffect,
  createDummyUnit,
  dmgEffect,
  dotEffect,
  healAction,
  meleeAttackAction,
  priestUnit,
  rangeAttackAction,
  reviveAction,
  skeletonUnit,
} from "./config";
import { test } from "./utils";

test("move", {
  initialState: {
    units: [
      skeletonUnit({ position: { x: 0, y: 0 }, team: 1, moveSpeed: 5 }),
      skeletonUnit({ position: { x: 80, y: 0 }, team: 2, moveSpeed: 5 }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ position: { x: 5, y: 0 } }, { position: { x: 75, y: 0 } }] },
});

test("dmg", {
  initialState: {
    units: [
      skeletonUnit({ position: { x: 0, y: 0 }, hp: 10, team: 1 }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 10 })], speed: 1, distance: 20 })],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ hp: 0 }, { hp: 10 }] },
});

test("dmg stack attributes", {
  initialState: {
    units: [
      skeletonUnit({ position: { x: 0, y: 0 }, hp: 100, team: 1 }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [
          meleeAttackAction({
            hitEffect: [dmgEffect({ power: 10 }), dmgEffect({ power: 10 })],
            speed: 1,
            distance: 20,
            cooldown: 10,
          }),
        ],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ hp: 80 }, { hp: 10 }] },
});

test("armor", {
  initialState: {
    units: [
      skeletonUnit({ position: { x: 0, y: 0 }, hp: 100, team: 1, effects: [armorEffect({ power: 5 })] }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [
          meleeAttackAction({
            hitEffect: [dmgEffect({ power: 10 })],
            speed: 1,
            distance: 20,
            cooldown: 10,
          }),
        ],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ hp: 95 }, { hp: 10 }] },
});

test("armor stack attributes", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 100,
        team: 1,
        effects: [armorEffect({ power: 5 }), armorEffect({ power: 2 })],
      }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [
          meleeAttackAction({
            hitEffect: [dmgEffect({ power: 10 })],
            speed: 1,
            distance: 20,
            cooldown: 10,
          }),
        ],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ hp: 97 }, { hp: 10 }] },
});

test("different dmg type with armors", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 100,
        team: 1,
        effects: [armorEffect({ power: 5, dmgType: DmgType.Fire }), armorEffect({ power: 2, dmgType: DmgType.Physical })],
      }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [
          meleeAttackAction({
            hitEffect: [dmgEffect({ power: 10, dmgType: DmgType.Fire })],
            speed: 1,
            distance: 20,
            cooldown: 10,
          }),
        ],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { units: [{ hp: 95 }, { hp: 10 }] },
});

test("dot dmg apply", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 50,
        team: 1,
        actions: [meleeAttackAction({ hitEffect: [], speed: 1, distance: 20 })],
      }),
      skeletonUnit({
        position: { x: 20, y: 0 },
        actions: [
          meleeAttackAction({
            hitEffect: [dotEffect({ interval: 1, period: 3, power: 10 })],
            speed: 1,
            distance: 20,
            cooldown: 5000,
          }),
        ],
        team: 2,
      }),
    ],
  },
  turn: 5,
  expectedState: { units: [{ hp: 20 }, { hp: 10 }] },
});

test("dmg range", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 10,
        team: 1,
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 10 })] })],
      }),
      skeletonUnit({
        hp: 10,
        position: { x: 20, y: 0 },
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: [4, 6] })], speed: 1, distance: 20 })],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: state => expect(state.units[0].hp >= 4 && state.units[0].hp <= 6).toBeTruthy(),
});

test("aura apply effect", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 10,
        team: 1,
        effects: [
          {
            type: EffectType.Aura,
            range: 100,
            seekTargetCondition: ["same-team", "alive"],
            effect: { type: EffectType.Armor, power: 2, dmgType: DmgType.Physical },
          },
        ],
        actions: [],
      }),
      skeletonUnit({
        position: { x: 10, y: 0 },
        hp: 10,
        team: 1,
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 0 })] })],
      }),
      skeletonUnit({
        hp: 10,
        position: { x: 20, y: 0 },
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 10 })], speed: 1, distance: 20 })],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: state => expect(state.units[1].hp).toBe(2),
});

test("aura dot refresh period", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 10,
        team: 1,
        effects: [
          {
            type: EffectType.Aura,
            range: 100,
            seekTargetCondition: ["enemy-team", "alive"],
            effect: {
              type: EffectType.Dot,
              effect: { type: EffectType.Dmg, power: 2, dmgType: DmgType.Fire },
              interval: 2,
              period: 2,
              uniqueId: "aura-dot-dmg",
            },
          },
        ],
        actions: [],
      }),
      skeletonUnit({
        hp: 10,
        position: { x: 20, y: 0 },
        actions: [],
        team: 2,
      }),
    ],
  },
  turn: 4,
  expectedState: state => [
    expect(state.units[1].hp).toBe(8),
    expect((state.units[1].effects[0] as DotEffect).state?.remainingPeriod).toBe(2),
  ],
});

test("aura apply effect only once based on unique id", {
  initialState: {
    units: [
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 10,
        team: 1,
        effects: [
          {
            type: EffectType.Aura,
            range: 100,
            seekTargetCondition: ["same-team", "alive"],
            effect: { type: EffectType.Armor, power: 2, dmgType: DmgType.Physical, uniqueId: "aura-def-1" },
          },
        ],
        actions: [],
      }),
      skeletonUnit({
        position: { x: 0, y: 0 },
        hp: 10,
        team: 1,
        effects: [
          {
            type: EffectType.Aura,
            range: 100,
            seekTargetCondition: ["same-team", "alive"],
            effect: { type: EffectType.Armor, power: 2, dmgType: DmgType.Physical, uniqueId: "aura-def-1" },
          },
        ],
        actions: [],
      }),
      skeletonUnit({
        position: { x: 10, y: 0 },
        hp: 10,
        team: 1,
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 0 })] })],
      }),
      skeletonUnit({
        hp: 10,
        position: { x: 20, y: 0 },
        actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: 10 })], speed: 1, distance: 20 })],
        team: 2,
      }),
    ],
  },
  turn: 1,
  expectedState: state => expect(state.units[2].hp).toBe(2),
});

test("shoot projectile", {
  initialState: {
    units: [
      skeletonUnit({ position: { x: 0, y: 0 }, hp: 10, team: 1 }),
      skeletonUnit({
        position: { x: 80, y: 0 },
        actions: [rangeAttackAction({ speed: 1, distance: 80, spriteId: "test-projectile" })],
        team: 2,
      }),
    ],
  },
  turn: 2,
  expectedState: { projectiles: [{ spriteId: "test-projectile" }] },
});

test("choose target unit with action which is closer #1 part", {
  initialState: {
    units: [
      createDummyUnit({ position: { x: 0, y: 0 }, team: 1 }),

      createDummyUnit({ position: { x: 20, y: 20 }, team: 2, hp: 10, maxHp: 100 }),
      createDummyUnit({ position: { x: 20, y: 60 }, team: 2, hp: 0, maxHp: 100 }),

      priestUnit({
        position: { x: 20, y: 100 },
        team: 2,
        actions: [healAction({ cooldown: 1, speed: 1 }), reviveAction({ speed: 1 })],
      }),
    ],
  },
  turn: 1,
  expectedState: state => {
    expect(state.units[1].hp).toBe(10);
    expect(state.units[2].hp).toBe(state.units[2].maxHp);
  },
});

test("choose target unit with action which is closer #2 part", {
  initialState: {
    units: [
      createDummyUnit({ position: { x: 0, y: 0 }, team: 1 }),

      createDummyUnit({ position: { x: 20, y: 20 }, team: 2, hp: 10, maxHp: 100 }),
      createDummyUnit({ position: { x: 20, y: 60 }, team: 2, hp: 0, maxHp: 100 }),

      priestUnit({
        position: { x: 20, y: 100 },
        team: 2,
        actions: [healAction({ cooldown: 1, speed: 1 }), reviveAction({ speed: 1 })],
      }),
    ],
  },
  turn: 12,
  expectedState: state => expect(state.units[1].hp).toBe(100),
});
