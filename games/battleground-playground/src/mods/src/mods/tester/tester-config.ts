import { BattlefieldInit, DmgType, EffectType } from "@battleground/core";

import { archerUnit, createDummyUnit, flagBearerUnit, priestUnit } from "./config";

// prettier-ignore
export const testerConfig: BattlefieldInit = {
  units: [
    createDummyUnit({ location: { x: 300, y: 300 }, team: 1 }),
    // flagBearerUnit({ location: { x: 280, y: 310 }, team: 1 }),
    flagBearerUnit({ location: { x: 280, y: 290 }, team: 1, effects: [{
        type: EffectType.Aura,
        range: 100,
        seekTargetCondition: ['enemy-team', 'alive'],
        effect: { type: EffectType.Dot, interval: 50, period: 5, effect: { type: EffectType.Dmg, dmgType: DmgType.Physical, power: 10 }, uniqueId: 'dot-dmg-aura' }
      }]
    }),

    // archerUnit({ location: { x: 500, y: 220 }, team: 2, moveSpeed: 0, hp: 10, maxHp: 100 }),
    // archerUnit({ location: { x: 500, y: 260 }, team: 2, moveSpeed: 0, hp: 0, maxHp: 100 }),
    // priestUnit({ location: { x: 500, y: 360 }, team: 2 }),
  ],
};
