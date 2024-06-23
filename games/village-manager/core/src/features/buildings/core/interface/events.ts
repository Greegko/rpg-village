import { Building } from "./building";

export enum BuildingEvent {
  Built = "building/built",
}

export enum BuildingActivityType {
  Build = "build",
}

export type BuildingActivityTargetID = string;

export interface BuildingEventBuiltArgs {
  building: Building;
  targetId: BuildingActivityTargetID;
}
