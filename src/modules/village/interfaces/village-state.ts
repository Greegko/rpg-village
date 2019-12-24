import { StashID } from "../../stash/interfaces";
import { MapLocationID } from "../../world/interfaces";

export interface VillageState {
  houses: number;
  stashId: StashID;
  locationId: MapLocationID;
}
