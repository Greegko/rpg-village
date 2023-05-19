import "@core/event";

import { VillageEvent, VillageEventBuildingBuiltArgs } from "../interfaces";

declare module "@core/event" {
  export interface EventType {
    [VillageEvent.BuildingBuilt]: VillageEventBuildingBuiltArgs;
  }
}
