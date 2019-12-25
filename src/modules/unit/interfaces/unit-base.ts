import { SkillID } from "../../skill/interfaces";
import { Equipment } from "../../../models";
import { ItemStash, ResourceStash } from "../../../models/stash";

export type UnitID = string;
export enum UnitType { Common, Unit };

export type Unit = {
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
  stash: ItemStash & ResourceStash;
};
