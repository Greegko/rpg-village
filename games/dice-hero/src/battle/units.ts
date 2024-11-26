import { clone } from "remeda";

import { EffectType, Unit } from "../data/model";

const missEffect = { name: "Miss", effects: [] };

export const heroUnit: Unit = {
  name: "The Protagonist",
  buffs: [],
  gold: 0,
  health: [100, 100],
  mana: [20, 20],
  stash: [],
  equipment: [
    {
      name: "The choosen sword",
      effects: [],
      die: [
        [1, missEffect],
        [5, { name: "Slice", effects: [{ type: EffectType.PhysicalDmg, value: 5 }] }],
      ],
    },
    {
      name: "The choosen shield",
      effects: [],
      die: [[6, { name: "Block", effects: [{ type: EffectType.Armor, value: 5 }] }]],
    },
    {
      name: "Healing Ring",
      effects: [],
      die: [
        [3, missEffect],
        [3, { name: "Minor Healing", effects: [{ type: EffectType.HpRegen, value: 2 }] }],
      ],
    },
  ],
};

export const wolf: Unit = {
  name: "Wolf",
  buffs: [],
  gold: 0,
  health: [50, 50],
  mana: [0, 0],
  stash: [],
  equipment: [
    {
      name: "Fang",
      effects: [],
      die: [
        [1, missEffect],
        [4, { name: "Bite", effects: [{ type: EffectType.PhysicalDmg, value: 5 }] }],
        [1, { name: "Tearing Bite", effects: [{ type: EffectType.PhysicalDmg, value: 8 }] }],
      ],
    },
    { name: "Fur", effects: [{ type: EffectType.Armor, value: 2 }] },
  ],
};

let enemyIndex = 0;
export function generateNewEnemy() {
  enemyIndex++;

  return clone(wolf);
}
