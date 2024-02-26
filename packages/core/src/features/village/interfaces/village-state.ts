import { MapLocationID } from "@features/map";
import { UnitID } from "@features/unit";
import { ItemStash, ResourceStash } from "@models";

export type VillageStash = ItemStash & ResourceStash;

export interface VillageState {
  id: string;
  houses: number;
  stash: VillageStash;
  locationId: MapLocationID;
  heroes: UnitID[];
}
