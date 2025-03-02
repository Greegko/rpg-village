import { BattlefieldInit } from "@rpg-village/battleground-core";

import { createDummyUnit, createWeakDummyUnit, heroUnit } from "./config";

export const playgroundDefaultBattlefieldInit: BattlefieldInit = {
  units: [
    createWeakDummyUnit({ hp: 30, position: { x: 400, y: 100 }, team: 2 }),
    createDummyUnit({ position: { x: 450, y: 100 }, team: 2 }),

    heroUnit({ position: { x: 400, y: 700 }, team: 1 }),
  ],
};
