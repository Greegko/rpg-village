import { StashID, LocationID } from "@greegko/rpg-model";

export interface VillageStoreState {
  houses: number;
  stash: StashID;
  locationId: LocationID;
}
