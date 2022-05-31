import { ItemStash, ResourceStash } from "@models//stash";
import { Equipment } from "@models/item";

export type UnitID = string;
export enum UnitType {
  Common,
  Hero,
}
export type UnitStash = ItemStash & ResourceStash;

export type Unit = {
  id: UnitID;
  name: string;
  level: number;
  hp: number;
  maxhp: number;
  type: UnitType;
  dmg: number;
  armor: number;
  xp: number;
  equipment: Equipment;
  stash: UnitStash;
};
