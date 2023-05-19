import { VillageBuilding } from "./village-buildings";

export enum VillageEvent {
  BuildingBuilt = "village/building-built",
}

export type VillageEventBuildingBuiltArgs = {
  buildingType: VillageBuilding;
  level: number;
};
