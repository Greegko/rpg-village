import { MapLocationID } from "../../world/interfaces";
import { UnitID } from "../../unit";
import { ItemStash, ResourceStash } from "../../../models/stash";

export type VillageStash = ItemStash & ResourceStash;

export interface VillageState {
  houses: number;
  stash: VillageStash;
  locationId: MapLocationID;
  heroes: UnitID[];
}
