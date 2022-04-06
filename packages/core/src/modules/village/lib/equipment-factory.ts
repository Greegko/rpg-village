import { generate } from "shortid";
import { Armor, ItemType, Shield, Weapon } from "@models/item";
import { AttackEffectType, DefenseEffectType } from "@models/effect";

export function weaponFactory(): Weapon {
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

export function shieldFactory(): Shield {
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

export function armorFactory(): Armor {
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
