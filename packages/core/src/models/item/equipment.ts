import { Armor, Shield, Weapon } from "./item-types";

export enum EquipmentPlace {
  Torso = "torso",
  LeftHand = "leftHand",
  RightHand = "rightHand",
}

export interface Equipment {
  torso?: Armor;
  leftHand?: Weapon;
  rightHand?: Weapon | Shield;
}
