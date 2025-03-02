import { Position } from "@rpg-village/utils/node";

import { dmgEffect, meleeAttackAction, skeletonUnit } from "./config";
import { test } from "./utils";

const randomTestUnit = ({ position, team }: { position: Position; team: number }) =>
  skeletonUnit({
    position,
    hp: 200,
    maxHp: 200,
    team,
    actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: [1, 100] })], cooldown: 1, speed: 1 })],
  });

test("same output on provided seed", {
  seed: "deterministic-run-test",
  initialState: {
    units: [
      randomTestUnit({ position: { x: 0, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 20, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 40, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 60, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 80, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 100, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 120, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 140, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 160, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 180, y: 0 }, team: 1 }),
      randomTestUnit({ position: { x: 200, y: 0 }, team: 1 }),

      randomTestUnit({ position: { x: 0, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 20, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 40, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 60, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 80, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 100, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 120, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 140, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 160, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 180, y: 200 }, team: 2 }),
      randomTestUnit({ position: { x: 200, y: 200 }, team: 2 }),
    ],
  },
  runUntilFinish: true,
  expectedTurn: 23,
});
