import { PortalSummoningStone } from "@features/buildings/portal-summoning-stone/interface";
import { Shop } from "@features/buildings/shop";
import { MapLocationID } from "@features/map";
import { Stash } from "@features/stash";
import { UnitID } from "@features/unit";

export type VillageID = string & { __typeGuard: "village-id" };

export interface VillageState {
  id: VillageID;
  stash: Stash;
  locationId: MapLocationID;
  heroes: UnitID[];
  buildings: {
    houses?: number;
    blacksmith?: number;
    trainingField?: number;
    runeWorkshop?: number;
    portalSummoningStone?: PortalSummoningStone;
    shop?: Shop;
  };
}
