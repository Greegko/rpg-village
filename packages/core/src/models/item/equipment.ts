import { Armor, Shield, Weapon } from "./item-types";

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
