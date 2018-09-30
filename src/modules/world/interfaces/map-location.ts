export type MapLocationID = string;
export enum MapLocationType { Village, Field, Desert, Mountain, Mine };

export type MapLocation = {
  type: MapLocationType;
  explored: boolean;
  x: number;
  y: number;
} 
