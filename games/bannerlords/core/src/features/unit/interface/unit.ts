export enum UnitType {
  Solider,
  Archer,
  Calavary,
}

export type UnitID = string;
export type Unit = { id: UnitID; name: string; unitType: UnitType };
