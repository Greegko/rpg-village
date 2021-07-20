export type MapLocationID = string;
export enum MapLocationType {
  Village,
  Field,
}

export type MapLocation = {
  id: MapLocationID;
  type: MapLocationType;
  explored: boolean;
  x: number;
  y: number;
};
