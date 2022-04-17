export type MapID = string;
export type MapLocationID = string;
export enum MapLocationType {
  Village,
  Field,
}

export type MapLocation = {
  id: MapLocationID;
  mapId: MapID;
  type: MapLocationType;
  explored: boolean;
  x: number;
  y: number;
};
