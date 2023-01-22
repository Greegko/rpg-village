import { generate } from "shortid";

import { AttackEffectType, DefenseEffectType, EffectType } from "@models/effect";
import { Armor, ItemType, Shield, Weapon } from "@models/item";

export function weaponFactory(): Weapon {
  return {
    itemType: ItemType.Weapon,
    effects: [
      {
        type: EffectType.Static,
        effectType: AttackEffectType.Dmg,
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
        type: EffectType.Static,
        effectType: DefenseEffectType.Armor,
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
        type: EffectType.Static,
        effectType: DefenseEffectType.Evasion,
        value: 5,
      },
    ],
    name: "Exalibur",
    id: generate(),
  };
}
