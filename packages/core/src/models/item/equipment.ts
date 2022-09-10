import { Armor, ItemType, Shield, Weapon } from "./item-types";

export enum EquipmentSlot {
  Torso = "torso",
  LeftHand = "leftHand",
  RightHand = "rightHand",
}

export interface Equipment {
  [EquipmentSlot.Torso]?: Armor;
  [EquipmentSlot.LeftHand]?: Weapon;
  [EquipmentSlot.RightHand]?: Shield;
}

export type EquipmentItem = Armor | Weapon | Shield;

export function isEquipmentItem(val: any): val is EquipmentItem {
  if (val.itemType === ItemType.Armor || val.itemType === ItemType.Shield || val.itemType === ItemType.Weapon)
    return true;

  return false;
}
