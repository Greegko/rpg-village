import { Unit, UnitType } from "@modules/unit";
import { PartyStash } from "@modules/party";

export interface EnemyPartyGeneration {
  units: Omit<Unit, "id">[];
  stash: PartyStash;
}

export function generateEnemyParty(difficulty: number): EnemyPartyGeneration {
  return {
    units: [generateEnemy(difficulty)],
    stash: { resource: { gold: (difficulty + 1) * 5 }, items: [] },
  };
}

function generateEnemy(point: number): Omit<Unit, "id"> {
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
    type: UnitType.Common,
  };
}
