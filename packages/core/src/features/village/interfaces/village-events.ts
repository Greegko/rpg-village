import { VillageID } from "./village";
import { VillageBuilding } from "./village-building";

export enum VillageEvent {
  BuildingBuilt = "village/building-built",
}

export interface VillageEventBuildingBuiltArgs {
  villageId: VillageID;
  level: number;
  buildingType: VillageBuilding;
}
