import { Armor, ItemType, Rune, Shield, Weapon } from "./item-types";

export enum EquipmentSlot {
  Torso = "torso",
  LeftHand = "leftHand",
  RightHand = "rightHand",
  Rune = 'rune'
}

export interface Equipment {
  [EquipmentSlot.Torso]?: Armor;
  [EquipmentSlot.LeftHand]?: Weapon;
  [EquipmentSlot.RightHand]?: Shield;
  [EquipmentSlot.Rune]?: Rune;
}

export type EquipmentItem = Armor | Weapon | Shield | Rune;

export function isEquipmentItem(val: any): val is EquipmentItem {
  if (val.itemType === ItemType.Armor || val.itemType === ItemType.Shield || val.itemType === ItemType.Weapon || val.itemType === ItemType.Rune)
    return true;

  return false;
}
