import { StashID } from "@greegko/rpg-model";
import { MapLocationID } from "../../world/interfaces";

export interface VillageStoreState {
  houses: number;
  stashId: StashID;
  locationId: MapLocationID;
}
