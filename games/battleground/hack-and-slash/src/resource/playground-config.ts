import { merge } from "rambda";

import { BattlefieldInit } from "@rpg-village/battleground-core";

import { createDummyUnit, createWeakDummyUnit, getConfig, heroUnit } from "./config";

export const playgroundDefaultBattlefieldInit: BattlefieldInit = {
  mapObjects: [merge(getConfig("golden-chest"), { position: { x: 200, y: 200 } })],
  units: [
    createWeakDummyUnit({ hp: 30, position: { x: 400, y: 100 }, team: 2 }),
    createDummyUnit({ position: { x: 450, y: 100 }, team: 2 }),

    heroUnit({ position: { x: 400, y: 700 }, team: 1 }),
  ],
};
