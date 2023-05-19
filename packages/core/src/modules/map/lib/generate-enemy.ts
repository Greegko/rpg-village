import { EffectStatic, MiscEffectType, calculateEffectsValue } from "@models";
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

function generateEnemy(difficulty: number, effects: EffectStatic[]): Omit<Unit, "id"> {
  const level = ~~(difficulty / 10) + 1;

  const hpModifiers = effects.filter(x => x.effectType === MiscEffectType.Hp);

  return {
    name: "Skeleton",
    armor: 0,
    dmg: 8 + ~~(difficulty / 10),
    equipment: {},
    hp: calculateEffectsValue(10 + difficulty * 2, hpModifiers),
    level,
    maxhp: calculateEffectsValue(10 + difficulty * 2, hpModifiers),
    stash: { resource: { gold: 0 }, items: [] },
    xp: 0,
    effects,
    criticalChance: 0,
    evasion: 0,
    type: UnitType.Common,
  };
}
