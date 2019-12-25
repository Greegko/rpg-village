import { StashID } from "../../stash/interfaces";
import { MapLocationID } from "../../world/interfaces";
import { UnitID } from "../../unit";

export interface VillageState {
  houses: number;
  stashId: StashID;
  locationId: MapLocationID;
  heroes: UnitID[];
}
