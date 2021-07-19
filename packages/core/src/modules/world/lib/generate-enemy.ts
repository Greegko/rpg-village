import { Unit, UnitType } from "@modules/unit";

export function generateEnemy(): Omit<Unit, 'id'> {
  return {
    name: 'Skeleton',
    armor: 1,
    dmg: 1,
    equipment: {},
    hp: 10,
    level: 1,
    maxhp: 10,
    skillIds: [],
    stash: { resource: { gold: 0 }, items: [] },
    xp: 0,
    type: UnitType.Common,
  }
}
