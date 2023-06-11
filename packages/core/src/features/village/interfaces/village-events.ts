import { VillageBuilding } from "./village-building";

export enum VillageEvent {
  BuildingBuilt = "village/building-built",
}

export interface VillageEventBuildingBuiltArgs {
  buildingType: VillageBuilding;
  level: number;
}
