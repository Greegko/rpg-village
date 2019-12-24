import { StashID } from "../../../../core-src";
import { MapLocationID } from "../../world/interfaces";

export interface VillageState {
  houses: number;
  stashId: StashID;
  locationId: MapLocationID;
}
