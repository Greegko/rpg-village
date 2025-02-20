import { BattlefieldInit } from "@rpg-village/battleground-core";

import { createDummyUnit, heroUnit } from "./config";

// prettier-ignore
export const playgroundDefaultBattlefieldInit: BattlefieldInit = {
  units: [
    createDummyUnit({ location: { x: window.innerWidth / 2, y: 100 }, team: 2 }),

    heroUnit({ location: { x: window.innerWidth / 2, y: window.innerHeight - 100 }, team: 1 }),
  ],
};
