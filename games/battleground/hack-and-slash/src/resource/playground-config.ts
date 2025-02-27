import { BattlefieldInit } from "@rpg-village/battleground-core";

import { createDummyUnit, heroUnit } from "./config";

export const playgroundDefaultBattlefieldInit: BattlefieldInit = {
  units: [createDummyUnit({ location: { x: 400, y: 100 }, team: 2 }), heroUnit({ location: { x: 400, y: 700 }, team: 1 })],
};
