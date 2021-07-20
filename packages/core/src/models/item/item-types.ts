import { BaseItem } from "./base-item";

export enum ItemType {
  Weapon,
  Armor,
  Shield,
}

export interface Armor extends BaseItem {
  itemType: ItemType.Armor;
}
export interface Weapon extends BaseItem {
  itemType: ItemType.Weapon;
}
export interface Shield extends BaseItem {
  itemType: ItemType.Shield;
}
