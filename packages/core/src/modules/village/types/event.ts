import { VillageEvent, VillageEventBuildingBuiltArgs } from "../interfaces";

declare module "@core" {
  export interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }
}
