import { sample } from "@rpg-village/core";

import { armorFactory, shieldFactory, weaponFactory } from "@features/item";
import { Unit, UnitType } from "@features/unit";

const lastname = [
  "Emperor",
  "Monk",
  "Lord",
  "Prince",
  "Chancellor",
  "Earl",
  "Yeoman",
  "Landgrave",
  "King",
  "Queen",
  "Princess",
  "Consort",
  "Duchess",
  "Grand",
  "Peasant",
  "Maiden",
  "Dame",
  "Reeve",
];
const male = ["Bernar", "Bruiant", "Reginald", "Wilcock", "Oggery", "Louve", "Jeremimum", "Helie", "Tibald", "Otebon"];
const female = ["Maalot", "Tillote", "Sarey", "Jossy", "Susanna", "Missa", "Aleneite", "Iseldis", "Sapphira", "Crystina"];

export function heroFactory(): Omit<Unit, "id"> {
  const firstNames = Math.random() > 0.5 ? male : female;

  return {
    level: 1,
    name: sample(lastname) + " " + sample(firstNames),
    hp: 100,
    maxhp: 100,
    equipment: {
      leftHand: weaponFactory(),
      rightHand: shieldFactory(),
      torso: armorFactory(),
    },
    armor: 0,
    dmg: 5,
    xp: 0,
    type: UnitType.Hero,
    stash: { resource: {}, items: [] },
    effects: [],
    criticalChance: 0,
    evasion: 0,
  };
}
