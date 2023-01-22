import { EffectStatic } from "@models/effect";
import { PartyStash } from "@modules/party";
import { Unit, UnitType } from "@modules/unit";

export interface EnemyPartyGeneration {
  units: Omit<Unit, "id">[];
  stash: PartyStash;
}

export function generateEnemyParty(difficulty: number, effects: EffectStatic[]): EnemyPartyGeneration {
  return {
    units: [generateEnemy(difficulty, effects)],
    stash: { resource: { gold: (difficulty + 1) * 5 }, items: [] },
  };
}

function generateEnemy(point: number, effects: EffectStatic[]): Omit<Unit, "id"> {
  const level = ~~(point / 10) + 1;

  return {
    name: "Skeleton",
    armor: 0,
    dmg: 8 + ~~(point / 10),
    equipment: {},
    hp: 10 + point * 2,
    level,
    maxhp: 10 + point * 2,
    stash: { resource: { gold: 0 }, items: [] },
    xp: 0,
    effects,
    criticalChance: 0,
    evasion: 0,
    type: UnitType.Common,
  };
}
