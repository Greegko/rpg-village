import { VillageBuilding } from "./village-buildings";

export enum VillageEvent {
  BuildingBuilt = "village/building-built",
}

export type VillageEventBuildingBuiltArgs = {
  buildingType: VillageBuilding;
  level: number;
};

declare module "@core/event" {
  export interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }
}
