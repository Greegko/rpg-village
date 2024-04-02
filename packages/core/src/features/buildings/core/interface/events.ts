import { Building } from "./building";

export enum BuildingEvent {
  Built,
}

export enum BuildingActivityType {
  Build = "build",
}

export type BuildingActivityTargetID = string & { __typeGuard: "building-activity-type-id" };

export interface BuildingEventBuiltArgs {
  building: Building;
  targetId: BuildingActivityTargetID;
}
