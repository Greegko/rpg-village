export type MapLocationID = string;
export enum MapLocationType {
  Empty,
  Village,
  Field,
  Portal,
  Boss,
}

export type MapLocation = {
  id: MapLocationID;
  type: MapLocationType;
  explored: boolean;
  x: number;
  y: number;
};
