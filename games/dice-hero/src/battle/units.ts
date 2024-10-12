import { EffectType, Unit } from "../data/model";

const missEffect = { name: "Miss", effects: [] };

export const heroUnit: Unit = {
  name: "The Protagonist",
  buffs: [],
  gold: 0,
  health: [100, 100],
  mana: [0, 0],
  stash: [],
  equipment: [
    {
      name: "The choosen sword",
      die: [
        [1, missEffect],
        [5, { name: "Slice", effects: [{ type: EffectType.PhysicalDmg, value: 5 }] }],
      ],
    },

    {
      name: "The choosen shield",
      die: [[6, { name: "Block", effects: [{ type: EffectType.PhysicalDmg, value: 5 }] }]],
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
      die: [
        [1, missEffect],
        [4, { name: "Bite", effects: [{ type: EffectType.PhysicalDmg, value: 5 }] }],
        [1, { name: "Tearing Bite", effects: [{ type: EffectType.PhysicalDmg, value: 8 }] }],
      ],
    },
    { name: "Fur", effects: [{ type: EffectType.Armor, value: 2 }] },
  ],
};
