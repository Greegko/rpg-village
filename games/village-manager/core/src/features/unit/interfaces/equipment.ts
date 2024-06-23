import { Armor, Rune, Shield, Weapon } from "@features/item";

export enum EquipmentSlot {
  Torso = "torso",
  LeftHand = "leftHand",
  RightHand = "rightHand",
  Rune = "rune",
}

export interface Equipment {
  [EquipmentSlot.Torso]?: Armor;
  [EquipmentSlot.LeftHand]?: Weapon;
  [EquipmentSlot.RightHand]?: Shield;
  [EquipmentSlot.Rune]?: Rune;
}

export type EquipmentItem = Armor | Weapon | Shield | Rune;
