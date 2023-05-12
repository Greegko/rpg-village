import { VillageBuilding } from "./village-buildings";

export enum VillageEvent {
  BuildingBuilt = "village/building-built",
}

export type VillageEventBuildingBuiltArgs = {
  buildingType: VillageBuilding;
  level: number;
};

declare module "@core/global-type/event-type" {
  export interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }
}
