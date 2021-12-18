import { generate } from "shortid";
import { Unit, UnitType } from "@modules/unit";
import { Armor, ItemType, Shield, Weapon } from "@models/item";
import { AttackEffectType, DefenseEffectType } from "@models/effect";
import { sample } from "@lib/sample";

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
const female = [
  "Maalot",
  "Tillote",
  "Sarey",
  "Jossy",
  "Susanna",
  "Missa",
  "Aleneite",
  "Iseldis",
  "Sapphira",
  "Crystina",
];

function weaponFactory(): Weapon {
  return {
    itemType: ItemType.Weapon,
    effects: [
      {
        type: AttackEffectType.Dmg,
        value: 5,
      },
    ],
    name: "Exalibur",
    id: generate(),
  };
}

function shieldFactory(): Shield {
  return {
    itemType: ItemType.Shield,
    effects: [
      {
        type: DefenseEffectType.Armor,
        value: 5,
      },
    ],
    name: "Exalibur",
    id: generate(),
  };
}

function armorFactory(): Armor {
  return {
    itemType: ItemType.Armor,
    effects: [
      {
        type: DefenseEffectType.Evasion,
        value: 5,
      },
    ],
    name: "Exalibur",
    id: generate(),
  };
}

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
  };
}
