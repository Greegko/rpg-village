import { Location } from "@greegko/rpg-model";

export enum MapLocationType { Village, Field, Desert, Mountain, Mine };

export interface MapLocation extends Location {
  type: MapLocationType;
} 
