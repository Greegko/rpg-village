import { MapLocationID } from "../../world/interfaces";
import { UnitID } from "../../unit";
import { ItemStash, ResourceStash } from "../../../models/stash";

export interface VillageState {
  houses: number;
  stash: ItemStash & ResourceStash;
  locationId: MapLocationID;
  heroes: UnitID[];
}
