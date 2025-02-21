import { Position } from "../src";
import { dmgEffect, meleeAttackAction, skeletonUnit } from "./config";
import { performanceTest } from "./utils/performance-test";

const randomTestUnit = ({ location, team }: { location: Position; team: number }) =>
  skeletonUnit({
    location,
    hp: 200,
    maxHp: 200,
    team,
    actions: [meleeAttackAction({ hitEffect: [dmgEffect({ power: [1, 100] })], cooldown: 1, speed: 1 })],
  });

performanceTest("perf-test", {
  seed: "deterministic-run-test",
  initialState: {
    units: [
      randomTestUnit({ location: { x: 0, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 20, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 40, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 60, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 80, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 100, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 120, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 140, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 160, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 180, y: 0 }, team: 1 }),
      randomTestUnit({ location: { x: 200, y: 0 }, team: 1 }),

      randomTestUnit({ location: { x: 0, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 20, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 40, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 60, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 80, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 100, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 120, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 140, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 160, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 180, y: 200 }, team: 2 }),
      randomTestUnit({ location: { x: 200, y: 200 }, team: 2 }),
    ],
  },
});
