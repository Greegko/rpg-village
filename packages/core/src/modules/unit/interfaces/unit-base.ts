import { SkillID } from "../../skill/interfaces";
import { Equipment } from "../../../models";
import { ItemStash, ResourceStash } from "../../../models/stash";

export type UnitID = string;
export enum UnitType { Common, Hero };
export type UnitStash = ItemStash & ResourceStash;

export type Unit = {
  id: UnitID;
  name: string;
  level: number;
  hp: number;
  maxhp: number;
  type: UnitType;
  skillIds: SkillID[];
  dmg: number;
  armor: number;
  xp: number;
  equipment: Equipment;
  stash: UnitStash;
};
