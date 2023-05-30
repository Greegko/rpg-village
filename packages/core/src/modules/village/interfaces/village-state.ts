import { UnitID } from "@features/unit";
import { ItemStash, ResourceStash } from "@models";
import { MapLocationID } from "@modules/map";
import { ShopID } from "@modules/shop";

export type VillageStash = ItemStash & ResourceStash;

export interface VillageState {
  houses: number;
  stash: VillageStash;
  locationId: MapLocationID;
  heroes: UnitID[];
  blacksmith: number;
  trainingField: number;
  runeWorkshop: number;
  portals: number;
  shop: { level: number; shopId: ShopID };
}
