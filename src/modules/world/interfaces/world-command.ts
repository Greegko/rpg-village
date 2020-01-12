import { MapLocationID } from "./map-location";

export enum WorldCommand {
  Explore = 'world/explore',
  Travel = 'world/travel',
  Battle = 'world/battle'
};

export interface BattleCommandArgs {
  locationId: MapLocationID;
}
