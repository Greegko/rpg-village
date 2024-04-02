import { Stash } from "@features/stash";
import { EffectStatic, Equipment } from "@models";

export type UnitID = string & { __typeGuard: "unit-id" };
export enum UnitType {
  Common,
  Hero,
}

export interface Unit {
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
  effects: EffectStatic[];
  stash: Stash;
  evasion: number;
  criticalChance: number;
}
