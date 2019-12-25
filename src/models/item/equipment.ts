import { Armor, Shield, Weapon } from './item-types';

export type EquipmentPlace = 'torso' | 'leftHand' | 'rightHand';

export interface Equipment {
  torso?: Armor;
  leftHand?: Weapon;
  rightHand?: Weapon | Shield;
}
