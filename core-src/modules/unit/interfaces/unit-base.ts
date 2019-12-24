export type UnitID = string;
export enum UnitType { Common, Hero };
export type UnitBase = {
  name: string;
  level: number;
  hp: number;
  maxhp: number;
  type: UnitType;
}
export type CommonUnit = UnitBase & { type: UnitType.Common };
