import { MapLocationID } from "@modules/map";
import { UnitID } from "@modules/unit";
import { ItemStash, ResourceStash } from "@models/stash";

export type VillageStash = ItemStash & ResourceStash;

export interface VillageState {
  houses: number;
  stash: VillageStash;
  locationId: MapLocationID;
  heroes: UnitID[];
  blacksmith: number;
  trainingField: number;
  runeWorkshop: number;
}
