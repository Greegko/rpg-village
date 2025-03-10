import { Position } from "@rpg-village/utils/node";

import { dmgEffect, meleeAttackAction, skeletonUnit } from "./config";
import { performanceTest } from "./utils/performance-test";

const randomTestUnit = ({ position, team }: { position: Position; team: number }) =>
  skeletonUnit({
    position,
    hp: 200,
    maxHp: 200,
    team,
    actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: [1, 100] })], cooldown: 1, speed: 1 })],
  });

performanceTest("perf-test", {
  seed: "deterministic-run-test",
  map: {
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
});

// Ticks    118
// Created  0.5469 ms
// Init     0.3437 ms
// Avg      7.2747 ms
// Total    1033.0022 ms between [960, 1100]
performanceTest("perf-test", {
  seed: "deterministic-run-test",
  map: {
    units: [
      ...Array.from({ length: 100 }).map((_, i) =>
        randomTestUnit({ position: { x: (i * 20) % 800, y: Math.floor(i / 800) + 100 }, team: 1 }),
      ),
      ...Array.from({ length: 100 }).map((_, i) =>
        randomTestUnit({ position: { x: (i * 20) % 800, y: Math.floor(i / 800) + 500 }, team: 2 }),
      ),
    ],
  },
});
