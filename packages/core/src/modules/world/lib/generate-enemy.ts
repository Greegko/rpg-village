import { Unit, UnitType } from "@modules/unit";

export function generateEnemy(difficulty: number): Omit<Unit, "id"> {
  return {
    name: "Skeleton",
    armor: 0,
    dmg: 8 + ~~(difficulty / 10),
    equipment: {},
    hp: 10 + difficulty * 2,
    level: ~~(difficulty / 10) + 1,
    maxhp: 10 + difficulty * 2,
    skillIds: [],
    stash: { resource: { gold: 0 }, items: [] },
    xp: 0,
    type: UnitType.Common,
  };
}
