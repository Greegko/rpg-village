export enum Product {
  Grain,
}

export enum ItemType {
  Grain,
}

export type ItemID = string;
export type Item = { id: ItemID; itemType: ItemType; amount: number };

export type Position = { x: number; y: number };

export type Stash = { gold: number; items: [] };

export enum UnitType {
  Solider,
  Archer,
  Calavary,
}

export type UnitID = string;
export type Unit = { id: UnitID; name: string; unitType: UnitType };

export type VillageID = string;
export interface Village {
  id: VillageID;
  name: string;
  prosperity: number;
  produce: Product;
  belongsTo: CastleID | TownID;
  position: Position;
  stash: Stash;
}

export type CastleID = string;
export interface Castle {
  id: string;
  name: string;
  belongTo: LordID;
  position: Position;
  garrison: Unit[];
  stash: Stash;
}

export type TownID = string;
export interface Town {
  id: string;
  name: string;
  belongTo: LordID;
  prosperity: number;
  position: Position;
  garrison: Unit[];
  stash: Stash;
}

export type LordID = string;
export interface Lord {
  id: string;
  name: string;
  belongTo: ClanID;
  stash: Stash;
  position: Position;
}

export type ClanID = string;
export interface Clan {
  id: string;
  name: string;
  belongTo: FractionID;
}

export type FractionID = string;
export interface Fraction {
  id: string;
  name: string;
}
